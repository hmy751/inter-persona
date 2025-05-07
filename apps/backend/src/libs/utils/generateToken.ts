import config from '@/config';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';

export const generateToken = (user: { id: string }) => {
  const payloadData: { id: string; iss?: string } = {
    id: user.id,
  };

  if (config.jwt.issuer !== undefined) {
    payloadData.iss = config.jwt.issuer;
  }

  const options = {
    expiresIn: config.jwt.expiresIn || '1Hour',
  } as SignOptions;

  const secret: Secret = config.jwt.secret as string;

  return jwt.sign(payloadData as object, secret, options);
};
