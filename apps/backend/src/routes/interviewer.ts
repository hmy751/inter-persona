import { prisma } from "@/app";
import { SERVER_ERROR, VALIDATION_ERROR, INTERVIEWER_ROUTE } from "@/libs/constant";
import { InterviewerListResponseSchema, InterviewerRequestSchema, InterviewerResponseSchema } from "@repo/schema/interviewer";
import { Router, Request, Response } from "express";

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const interviewers = await prisma.interviewer.findMany();

    const responseData = InterviewerListResponseSchema.safeParse(interviewers);

    res.json(responseData.data);
  } catch (error) {
    res.status(500).json({
      message: SERVER_ERROR?.internal || 'Internal server error',
    });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const validationResult = InterviewerRequestSchema.safeParse(req.params.id);

    if (!validationResult.success) {
      res.status(400).json({
        message: VALIDATION_ERROR?.invalidInput || 'Invalid input',
        errors: validationResult.error.flatten().fieldErrors,
      });
    }

    const interviewer = await prisma.interviewer.findUnique({
      where: { id: parseInt(id!) },
    });

    if (!interviewer) {
      res.status(404).json({
        message: INTERVIEWER_ROUTE?.notFound,
      });
      return;
    }

    const responseData = InterviewerResponseSchema.safeParse(interviewer);

    res.json(responseData.data);
  } catch (error) {
    res.status(500).json({
      message: SERVER_ERROR?.internal || 'Internal server error',
    });
  }
});

export default router;
