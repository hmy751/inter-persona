import { prisma } from '@/app';
import { authenticate } from '@/middleware/auth';
import { Router, Request, Response } from 'express';
import {
  InterviewRequestSchema,
  InterviewResponseSchema,
  InterviewInterviewerRequestSchema,
  InterviewInterviewerResponseSchema,
  InterviewUserRequestSchema,
  InterviewUserResponseSchema,
  InterviewContentsResponseSchema,
} from '@repo/schema/interview';
import { INTERVIEW_ROUTE, SERVER_ERROR, VALIDATION_ERROR } from '@/libs/constant';
const router: Router = Router();

// 인터뷰 생성
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const validation = InterviewRequestSchema.safeParse({
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
      res.status(404).json({ message: INTERVIEW_ROUTE.notFoundInterviewer });
      return;
    }

    if (!category) {
      res.status(400).json({ message: INTERVIEW_ROUTE.invalidCategory });
      return;
    }

    const interview = await prisma.interview.create({
      data: { userId, interviewerId, status: 'ongoing', category },
    });

    const response = InterviewResponseSchema.safeParse({ interviewId: interview.id });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({ message: SERVER_ERROR.internal });
  }
});

router.get('/:id/contents', authenticate, async (req: Request, res: Response) => {
  try {
    const { id: interviewId } = req.params;

    const interview = await prisma.interview.findUnique({ where: { id: Number(interviewId) } });

    if (!interview) {
      res.status(404).json({ message: INTERVIEW_ROUTE.notFoundInterview });
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

router.get('/:id/interviewer', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id: interviewId } = req.params;

    const validation = InterviewInterviewerRequestSchema.safeParse({ interviewId: Number(interviewId) });

    if (!validation.success) {
      res.status(400).json({ message: VALIDATION_ERROR.invalidInput, errors: validation.error.flatten().fieldErrors });
      return;
    }

    const interview = await prisma.interview.findUnique({ where: { id: Number(interviewId) } });

    if (!interview) {
      res.status(404).json({ message: INTERVIEW_ROUTE.notFoundInterview });
      return;
    }

    if (interview?.userId !== userId) {
      res.status(403).json({ message: INTERVIEW_ROUTE.notFoundUser });
      return;
    }

    const interviewer = await prisma.interviewer.findUnique({ where: { id: interview.interviewerId } });

    if (!interviewer) {
      res.status(404).json({ message: INTERVIEW_ROUTE.notFoundInterviewer });
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

    const interview = await prisma.interview.findUnique({ where: { id: Number(interviewId) } });

    if (!interview) {
      res.status(404).json({ message: INTERVIEW_ROUTE.notFoundInterview });
      return;
    }

    if (interview?.userId !== userId) {
      res.status(403).json({ message: INTERVIEW_ROUTE.notFoundUser });
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
