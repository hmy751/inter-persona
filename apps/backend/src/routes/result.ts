import { prisma } from '@/app';
import { authenticate } from '@/middleware/auth';
import { Router, Request, Response, NextFunction } from 'express';
import { RESULT_ROUTE, VALIDATION_ERROR } from '@/libs/constant';
import { generateEvaluation } from '@/libs/utils/prompt';
import {
  CreateResultRequestSchema,
  CreateResultResponseSchema,
  GetResultRequestSchema,
  GetResultResponseSchema,
} from '@repo/schema/result';

const router: Router = Router();

router.post('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  const { interviewId } = req.body;

  const validation = CreateResultRequestSchema.safeParse({ interviewId: Number(interviewId) });

  if (!validation.success) {
    res.status(400).json({ message: VALIDATION_ERROR.invalidInput, errors: validation.error.flatten().fieldErrors });
    return;
  }

  try {
    const interview = await prisma.interview.findUnique({
      where: {
        id: interviewId,
      },
      select: {
        id: true,
        result: true,
      },
    });

    if (!interview) {
      res.status(404).json({ message: RESULT_ROUTE.error.notFoundInterview });
      return;
    }

    if (interview?.result) {
      res.status(409).json({ id: interview.result.id, message: RESULT_ROUTE.message.alreadyExists });
      return;
    }

    const contents = await prisma.interviewContent.findMany({
      where: {
        interviewId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const { success, scores, contentFeedback, feedback } = await generateEvaluation(contents);

    if (!success) {
      res.status(500).json({ message: RESULT_ROUTE.error.failedToCreateResult });
      return;
    }

    const result = await prisma.result.create({
      data: {
        interviewId,
        scores,
        contentFeedback,
        feedback,
      },
    });

    const response = CreateResultResponseSchema.safeParse({ id: result.id });

    if (!response.success) {
      res.status(400).json({ message: VALIDATION_ERROR.invalidInput, errors: response.error.flatten().fieldErrors });
      return;
    }

    res.status(201).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create result' });
  }
});

router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  const { id: resultId } = req.params;

  const validation = GetResultRequestSchema.safeParse({ id: Number(resultId) });

  if (!validation.success) {
    res.status(400).json({ message: VALIDATION_ERROR.invalidInput, errors: validation.error.flatten().fieldErrors });
    return;
  }

  try {
    const result = await prisma.result.findUnique({
      where: { id: Number(resultId) },
      include: {
        interview: {
          include: {
            interviewer: true,
            user: true,
          },
        },
      },
    });

    if (!result) {
      res.status(404).json({ message: RESULT_ROUTE.error.notFoundResult });
      return;
    }

    const response = GetResultResponseSchema.safeParse({
      id: result.id,
      scores: result.scores,
      contentFeedback: result.contentFeedback,
      feedback: result.feedback,
      interviewId: result.interviewId,
      interview: result.interview,
      userId: result.interview.userId,
      user: result.interview.user,
      interviewerId: result.interview.interviewerId,
      interviewer: result.interview.interviewer,
    });

    if (!response.success) {
      res.status(400).json({ message: VALIDATION_ERROR.invalidInput, errors: response.error.flatten().fieldErrors });
      return;
    }

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get result' });
  }
});

export default router;
