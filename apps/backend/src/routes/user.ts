import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '@/app';
import bcrypt from 'bcrypt';
import { USER_ROUTE, SERVER_ERROR, VALIDATION_ERROR } from '@/libs/constant';
import { DEFAULT_PROFILE_IMAGE_URL } from '@repo/constant/name';
import { generateToken } from '@/libs/utils/generateToken';
import { uploadFile } from '@/middleware/uploadFile';
import { getS3Client, uploadToS3 } from '@/libs/utils/uploadS3';
import { LoginRequestSchema, RegisterRequestSchema, RegisterResponseSchema, LoginResponseSchema, UserInfoResponseSchema } from '@repo/schema/user';
import config from '@/config';
import { authenticate } from '@/middleware/auth';

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

    res.cookie('token', token, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });

    const responseData = LoginResponseSchema.safeParse({
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
    } else {
      profileImageUrl = DEFAULT_PROFILE_IMAGE_URL;
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

router.get('/info', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  if (!req?.user?.id) {
    res.status(401).json({ message: USER_ROUTE.unauthorized });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    const responseData = UserInfoResponseSchema.safeParse({
      id: user?.id,
      email: user?.email,
      name: user?.name,
      profileImageUrl: user?.profileImageUrl,
    });

    res.status(200).json(responseData.data);
  } catch (error) {
    console.error('User info error:', error);
    res.status(500).json({ message: SERVER_ERROR.internal });
  }
});

export default router;
