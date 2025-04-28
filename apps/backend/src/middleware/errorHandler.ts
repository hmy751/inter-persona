import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('에러 발생:', error);

  // Prisma 특정 에러 처리
  if (error instanceof Error && 'code' in error) {
    const prismaError = error as any;

    // 유니크 제약 조건 위반 (e.g. 이메일 중복)
    if (prismaError.code === 'P2002') {
      const target = prismaError.meta?.target || ['알 수 없는 필드'];
      return res.status(409).json({
        message: '중복된 값이 있습니다',
        field: target,
      });
    }

    // 데이터를 찾을 수 없음
    if (prismaError.code === 'P2001' || prismaError.code === 'P2025') {
      return res.status(404).json({
        message: '요청한 리소스를 찾을 수 없습니다',
      });
    }
  }

  // Prisma 검증 에러
  if (error.name === 'PrismaClientValidationError') {
    return res.status(400).json({
      message: '요청 데이터가 유효하지 않습니다',
    });
  }

  // 기본 에러 핸들링
  return res.status(500).json({
    message: '서버 내부 오류가 발생했습니다',
  });
}; 
