import { prisma } from '@/app';
import { authenticate } from '@/middleware/auth';
import { Router, Request, Response } from 'express';
import { InterviewRequestSchema, InterviewResponseSchema } from '@repo/schema/interview';
import { INTERVIEW_ROUTE, SERVER_ERROR } from '@/libs/constant';
const router: Router = Router();

// 면접 시작
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const validation = InterviewRequestSchema.safeParse({
      interviewerId: req.body.interviewerId,
      userId: req.user?.id,
      category: req.body.category,
    });

    if (!validation.success) {
      res.status(400).json({ message: 'Invalid input', errors: validation.error.flatten().fieldErrors });
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

export default router;
