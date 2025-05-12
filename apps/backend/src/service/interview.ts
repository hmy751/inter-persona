import { prisma } from "@/app";
import { INTERVIEW_CHAT_LIMIT, INTERVIEW_ROUTE } from "@/libs/constant";
import { Interviewer } from "@/libs/utils/prompt";
import { checkNextQuestionRelated } from "@/libs/utils/prompt";
import { askQuestion } from "@/libs/utils/prompt";

type Result<T> = {
  isValid: boolean;
  data?: T;
  error?: {
    statusCode: number;
    message: string;
  };
};

export const checkInterviewChatLimit = async (interviewId: number): Promise<Result<unknown>> => {
  const beforeContents = await prisma.interviewContent.findMany({
    where: { interviewId },
  });

  if (beforeContents.length > INTERVIEW_CHAT_LIMIT) {
    await prisma.interview.update({
      where: { id: interviewId },
      data: { status: 'completed' },
    });

    return {
      isValid: false,
      error: {
        statusCode: 400,
        message: INTERVIEW_ROUTE.error.chatLimit,
      },
    };
  }

  if (beforeContents.length === INTERVIEW_CHAT_LIMIT) {
    await prisma.interview.update({
      where: { id: interviewId },
      data: { status: 'completed' },
    });

    const lastQuestion = await prisma.interviewContent.create({
      data: {
        interviewId,
        content: INTERVIEW_ROUTE.message.lastQuestion,
        speaker: 'interviewer',
      },
    });

    return {
      isValid: false,
      data: {
        content: lastQuestion.content,
        speaker: lastQuestion.speaker,
      },
    }
  }

  return {
    isValid: true,
  }
};

export const handleAnswer = async (interviewId: number, interviewer: Interviewer): Promise<Result<unknown>> => {
  const contents = await prisma.interviewContent.findMany({
    where: { interviewId: interviewId },
    orderBy: { createdAt: 'asc' },
  });

  const isRelated = await checkNextQuestionRelated(contents);

  const nextQuestion = await askQuestion(interviewer as unknown as Interviewer, contents, isRelated);

  const savedQuestion = await prisma.interviewContent.create({
    data: {
      interviewId: interviewId,
      content: nextQuestion,
      speaker: 'interviewer',
    },
  });

  return {
    isValid: true,
    data: {
      content: savedQuestion.content,
      speaker: savedQuestion.speaker,
    },
  };
};
