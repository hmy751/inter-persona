import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import config from '@/config';
import { prisma } from '@/app';
import { VERIFY_AUTH_ERROR, SERVER_ERROR } from '@/libs/constant';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: VERIFY_AUTH_ERROR.unauthorized });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: VERIFY_AUTH_ERROR.unauthorized });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret as string) as JwtPayload;

    if (decoded.iss !== config.jwt.issuer) {
      return res.status(401).json({ message: VERIFY_AUTH_ERROR.invalid });
    }

    const foundUser = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!foundUser) {
      return res.status(401).json({ message: VERIFY_AUTH_ERROR.unauthorized });
    }

    req.user = {
      ...foundUser,
    };

    return next();
  } catch (err) {
    console.error('Verify token error:', err);
    if (err instanceof TokenExpiredError) {
      return res.status(401).json({ message: VERIFY_AUTH_ERROR.expired });
    }

    if (err instanceof JsonWebTokenError) {
      return res.status(401).json({ message: VERIFY_AUTH_ERROR.invalid });
    }

    return res.status(500).json({ message: SERVER_ERROR.internal });
  }
};
