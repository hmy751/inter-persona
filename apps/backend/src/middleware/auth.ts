import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
const { TokenExpiredError, JsonWebTokenError } = jwt;

import config from '@/config';
import { prisma } from '@/app';
import { VERIFY_AUTH_ERROR, SERVER_ERROR } from '@/libs/constant';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req?.cookies?.token;

  if (!token) {
    res.status(401).json({ message: VERIFY_AUTH_ERROR.unauthorized });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret as string) as JwtPayload;

    if (decoded.iss !== config.jwt.issuer) {
      res.status(401).json({ message: VERIFY_AUTH_ERROR.invalid });
      return;
    }

    const foundUser = await prisma.user.findUnique({
      where: {
        id: parseInt(decoded.id),
      },
    });

    if (!foundUser) {
      res.status(401).json({ message: VERIFY_AUTH_ERROR.unauthorized });
      return;
    }

    req.user = {
      ...foundUser,
    };

    next();
  } catch (err) {
    console.error('Verify token error:', err);
    if (err instanceof TokenExpiredError) {
      res.status(401).json({ message: VERIFY_AUTH_ERROR.expired });
      return;
    }

    if (err instanceof JsonWebTokenError) {
      res.status(401).json({ message: VERIFY_AUTH_ERROR.invalid });
      return;
    }

    res.status(500).json({ message: SERVER_ERROR.internal });
  }
};
