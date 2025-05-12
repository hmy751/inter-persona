import { prisma } from '@/app';
import { authenticate } from '@/middleware/auth';
import { Router, Request, Response, NextFunction } from 'express';
import { RESULT_ROUTE, VALIDATION_ERROR } from '@/libs/constant';
import { generateEvaluation } from '@/libs/utils/prompt';

const router: Router = Router();

router.post('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  const { interviewId } = req.body;

  if (!interviewId) {
    res.status(400).json({ message: VALIDATION_ERROR.invalidInput });
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
      res.status(409).json({ data: interview, message: RESULT_ROUTE.message.alreadyExists });
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

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create result' });
  }
});

export default router;
