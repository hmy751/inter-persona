import { prisma } from '@/app';
import { authenticate } from '@/middleware/auth';
import { Router, Request, Response } from 'express';
import {
  InterviewRequestSchema,
  InterviewResponseSchema,
  InterviewCreateRequestSchema,
  InterviewCreateResponseSchema,
  InterviewInterviewerRequestSchema,
  InterviewInterviewerResponseSchema,
  InterviewUserRequestSchema,
  InterviewUserResponseSchema,
  InterviewContentsResponseSchema,
  InterviewStartResponseSchema,
  InterviewStartRequestSchema,
  InterviewAnswerRequestSchema,
  InterviewAnswerResponseSchema,
  InterviewStatusRequestSchema,
  InterviewStatusResponseSchema,
} from '@repo/schema/interview';
import { INTERVIEW_ROUTE, SERVER_ERROR, VALIDATION_ERROR } from '@/libs/constant';
import { Interviewer } from '@/libs/utils/prompt';
import { checkInterviewChatLimit, handleAnswer } from '@/service/interview';

const router: Router = Router();

// 인터뷰 생성
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const validation = InterviewCreateRequestSchema.safeParse({
      interviewerId: req.body.interviewerId,
      userId: req.user?.id,
      category: req.body.category,
    });

    if (!validation.success) {
      res.status(400).json({ message: VALIDATION_ERROR.invalidInput, errors: validation.error.flatten().fieldErrors });
      return;
    }

    const { interviewerId, userId, category } = validation.data;

    const interviewer = await prisma.interviewer.findUnique({ where: { id: interviewerId } });

    if (!interviewer) {
      res.status(404).json({ message: INTERVIEW_ROUTE.error.notFoundInterviewer });
      return;
    }

    if (!category) {
      res.status(400).json({ message: INTERVIEW_ROUTE.error.invalidCategory });
      return;
    }

    const interview = await prisma.interview.create({
      data: { userId, interviewerId, status: 'ongoing', category },
    });

    const response = InterviewCreateResponseSchema.safeParse({ interviewId: interview.id });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({ message: SERVER_ERROR.internal });
  }
});

router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id: interviewId } = req.params;

    const validation = InterviewRequestSchema.safeParse({ interviewId: Number(interviewId) });

    if (!validation.success) {
      res.status(400).json({ message: VALIDATION_ERROR.invalidInput, errors: validation.error.flatten().fieldErrors });
      return;
    }

    const interview = await prisma.interview.findUnique({
      where: { id: Number(interviewId) },
      include: { user: true, interviewer: true, contents: true }
    });

    if (!interview) {
      res.status(404).json({ message: INTERVIEW_ROUTE.error.notFoundInterview });
      return;
    }

    const response = InterviewResponseSchema.safeParse({ interview });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Get interview error:', error);
    res.status(500).json({ message: SERVER_ERROR.internal });
  }
});

router.get('/:id/contents', authenticate, async (req: Request, res: Response) => {
  try {
    const { id: interviewId } = req.params;

    const interview = await prisma.interview.findUnique({ where: { id: Number(interviewId) }, select: { id: true } });

    if (!interview) {
      res.status(404).json({ message: INTERVIEW_ROUTE.error.notFoundInterview });
      return;
    }

    const contents = await prisma.interviewContent.findMany({ where: { interviewId: Number(interviewId) } });

    const response = InterviewContentsResponseSchema.safeParse({ contents });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Get interview contents error:', error);
    res.status(500).json({ message: SERVER_ERROR.internal });
  }
});

router.post('/:id/start', authenticate, async (req: Request, res: Response) => {
  try {
    const { id: interviewId } = req.params;

    const validation = InterviewStartRequestSchema.safeParse({ interviewId: Number(interviewId) });

    if (!validation.success) {
      res.status(400).json({ message: VALIDATION_ERROR.invalidInput, errors: validation.error.flatten().fieldErrors });
      return;
    }

    const interview = await prisma.interview.findUnique({
      where: { id: Number(interviewId) }, select: {
        id: true,
      }
    });

    if (!interview) {
      res.status(404).json({ message: INTERVIEW_ROUTE.error.notFoundInterview });
      return;
    }

    const foundFirstQuestion = await prisma.interviewContent.findFirst({ where: { interviewId: Number(interviewId), speaker: 'interviewer' } });

    if (foundFirstQuestion) {
      const response = InterviewStartResponseSchema.safeParse({ content: foundFirstQuestion.content, speaker: foundFirstQuestion.speaker });
      res.status(200).json(response.data);
      return;
    }

    const firstQuestion = await prisma.interviewContent.create({
      data: { interviewId: Number(interviewId), content: INTERVIEW_ROUTE.message.firstQuestion, speaker: 'interviewer' },
    });

    const response = InterviewStartResponseSchema.safeParse({ content: firstQuestion.content, speaker: firstQuestion.speaker });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({ message: SERVER_ERROR.internal });
  }
});

router.post('/:id/contents/answer', authenticate, async (req: Request, res: Response) => {
  try {
    const { id: interviewId } = req.params;
    const { content } = req.body;

    const validation = InterviewAnswerRequestSchema.safeParse({
      interviewId: Number(interviewId),
      content,
    });

    if (!validation.success) {
      res.status(400).json({ message: VALIDATION_ERROR.invalidInput, errors: validation.error.flatten().fieldErrors });
      return;
    }

    const { interviewId: validatedInterviewId, content: validatedAnswer } = validation.data;

    const interview = await prisma.interview.findUnique({
      where: { id: validatedInterviewId },
      select: { interviewer: true },
    });

    if (!interview) {
      res.status(404).json({ message: INTERVIEW_ROUTE.error.notFoundInterview });
      return;
    }

    const interviewer = interview.interviewer;

    if (!interviewer) {
      res.status(404).json({ message: INTERVIEW_ROUTE.error.notFoundInterviewer });
      return;
    }

    await prisma.interviewContent.create({
      data: {
        interviewId: validatedInterviewId,
        content: validatedAnswer,
        speaker: 'user',
      },
    });

    const chatLimitResult = await checkInterviewChatLimit(validatedInterviewId);

    if (!chatLimitResult.isValid) {
      if (chatLimitResult.data) {
        const response = InterviewAnswerResponseSchema.safeParse(chatLimitResult.data);
        res.status(200).json(response.data);
        return;
      }

      res.status(chatLimitResult.error?.statusCode || 500).json({ message: chatLimitResult.error?.message || SERVER_ERROR.internal });
      return;
    }

    const answerResult = await handleAnswer(validatedInterviewId, interviewer as unknown as Interviewer);

    if (!answerResult.isValid) {
      res.status(answerResult.error?.statusCode || 500).json({ message: answerResult.error?.message || SERVER_ERROR.internal });
      return;
    }

    const response = InterviewAnswerResponseSchema.safeParse(answerResult.data);

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Answer interview error:', error);
    res.status(500).json({ message: SERVER_ERROR.internal });
  }
});

router.get('/:id/status', authenticate, async (req: Request, res: Response) => {
  try {
    const { id: interviewId } = req.params;

    const validation = InterviewStatusRequestSchema.safeParse({ interviewId: Number(interviewId) });

    if (!validation.success) {
      res.status(400).json({ message: VALIDATION_ERROR.invalidInput, errors: validation.error.flatten().fieldErrors });
      return;
    }

    const interview = await prisma.interview.findUnique({ where: { id: Number(interviewId) }, select: { status: true } });

    if (!interview) {
      res.status(404).json({ message: INTERVIEW_ROUTE.error.notFoundInterview });
      return;
    }

    const response = InterviewStatusResponseSchema.safeParse({ status: interview.status });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Get interview status error:', error);
    res.status(500).json({ message: SERVER_ERROR.internal });
  }
});

router.get('/:id/interviewer', authenticate, async (req: Request, res: Response) => {
  try {
    const { id: interviewId } = req.params;

    const validation = InterviewInterviewerRequestSchema.safeParse({ interviewId: Number(interviewId) });

    if (!validation.success) {
      res.status(400).json({ message: VALIDATION_ERROR.invalidInput, errors: validation.error.flatten().fieldErrors });
      return;
    }

    const interview = await prisma.interview.findUnique({ where: { id: Number(interviewId) }, select: { interviewerId: true } });

    if (!interview) {
      res.status(404).json({ message: INTERVIEW_ROUTE.error.notFoundInterview });
      return;
    }

    const interviewer = await prisma.interviewer.findUnique({ where: { id: interview.interviewerId } });

    if (!interviewer) {
      res.status(404).json({ message: INTERVIEW_ROUTE.error.notFoundInterviewer });
      return;
    }

    const response = InterviewInterviewerResponseSchema.safeParse({ interviewer });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Get interviewer error:', error);
    res.status(500).json({ message: SERVER_ERROR.internal });
  }
});

router.get('/:id/user', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id: interviewId } = req.params;

    const validation = InterviewUserRequestSchema.safeParse({ interviewId: Number(interviewId) });

    if (!validation.success) {
      res.status(400).json({ message: VALIDATION_ERROR.invalidInput, errors: validation.error.flatten().fieldErrors });
      return;
    }

    const interview = await prisma.interview.findUnique({ where: { id: Number(interviewId) }, select: { userId: true } });

    if (!interview) {
      res.status(404).json({ message: INTERVIEW_ROUTE.error.notFoundInterview });
      return;
    }

    if (interview?.userId !== userId) {
      res.status(403).json({ message: INTERVIEW_ROUTE.error.notFoundUser });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: interview.userId } });

    const response = InterviewUserResponseSchema.safeParse({ user });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: SERVER_ERROR.internal });
  }
});

export default router;
