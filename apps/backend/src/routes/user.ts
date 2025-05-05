import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '@/app';
import bcrypt from 'bcrypt';
import { generateToken } from '@/libs/utils';
import { SERVER_ERROR, VALIDATION_ERROR, VERIFY_AUTH_ERROR } from '@repo/constant/message';
import { LoginSchema } from '@repo/schema/user';

const router: Router = Router();

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationResult = LoginSchema.safeParse(req.body);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;

      res.status(400).json({
        message: VALIDATION_ERROR?.invalidInput || 'Invalid input',
        errors: fieldErrors,
      });
      return;
    }

    const { email, password } = validationResult.data;

    const foundUser = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!foundUser) {
      res.status(401).json({ message: VERIFY_AUTH_ERROR.unauthorized });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: VERIFY_AUTH_ERROR?.invalidCredentials || 'Invalid credentials' });
      return;
    }

    const token = generateToken({ id: foundUser.id.toString() });

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: SERVER_ERROR.internal });
  }
});

router.post('/join', (req, res) => {
  res.send('Hello World!');
});

export default router;
