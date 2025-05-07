import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '@/app';
import bcrypt from 'bcrypt';
import { USER_ROUTE, SERVER_ERROR, VALIDATION_ERROR } from '@/libs/constant';
import { generateToken } from '@/libs/utils/generateToken';
import { uploadFile } from '@/middleware/uploadFile';
import { getS3Client, uploadToS3 } from '@/libs/utils/uploadS3';
import { LoginRequestSchema, RegisterRequestSchema, RegisterResponseSchema, LoginResponseSchema } from '@repo/schema/user';

const router: Router = Router();

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationResult = LoginRequestSchema.safeParse(req.body);

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
      res.status(401).json({ message: USER_ROUTE.unauthorized });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: USER_ROUTE.invalidCredentials });
      return;
    }

    const token = generateToken({ id: foundUser.id.toString() });

    const responseData = LoginResponseSchema.safeParse({
      token,
      success: true,
      message: USER_ROUTE.loginSuccess,
    });

    res.status(201).json(responseData.data);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: SERVER_ERROR.internal });
  }
});

router.post('/register', uploadFile.single('profileImage'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationResult = RegisterRequestSchema.safeParse(req.body);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;

      res.status(400).json({
        message: VALIDATION_ERROR?.invalidInput || 'Invalid input',
        errors: fieldErrors,
      });
      return;
    }

    const { email, password, name } = validationResult.data;

    const foundUser = await prisma.user.findUnique({
      where: { email },
    });

    if (foundUser) {
      res.status(400).json({ message: USER_ROUTE.alreadyExists });
      return;
    }

    let profileImageUrl: string | null = null;

    const s3Client = getS3Client();

    if (req.file) {
      const uploadResult = await uploadToS3(s3Client, req.file);
      profileImageUrl = uploadResult.Location;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, name, profileImageUrl },
    });

    const responseData = RegisterResponseSchema.safeParse({
      success: true,
      message: USER_ROUTE.registerSuccess,
    });

    res.status(201).json(responseData.data);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: SERVER_ERROR.internal });
  }
});

export default router;
