import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import config from '@/config';
import { DEFAULT_PROFILE_IMAGE_NAME, DEFAULT_PROFILE_IMAGE_URL } from '@repo/constant/name';

const S3_BUCKET_NAME = config.s3.bucketName || '';
const AWS_REGION = config.s3.region || '';
const AWS_ACCESS_KEY_ID = config.s3.accessKeyId || '';
const AWS_SECRET_ACCESS_KEY = config.s3.secretAccessKey || '';

if (!S3_BUCKET_NAME || !AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  if (process.env.NODE_ENV !== 'test') {
    console.warn(
      'S3 environment variables (S3_BUCKET_NAME, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY) are not fully configured. S3 uploads may fail.'
    );
  }
}

let s3Client: S3Client;

export const getS3Client = (): S3Client => {
  if (!s3Client) {
    s3Client = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3Client;
};

interface UploadToS3Result {
  Location: string;
  ETag?: string;
  Bucket?: string;
  Key?: string;
}

export const uploadToS3 = async (
  client: S3Client,
  file: Express.Multer.File,
  folder: string = 'profile-images'
): Promise<UploadToS3Result> => {
  const isDefaultImage = file.originalname === DEFAULT_PROFILE_IMAGE_NAME;

  if (isDefaultImage) {
    return {
      Location: DEFAULT_PROFILE_IMAGE_URL,
    };
  }

  const key = `${folder}/${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;

  try {
    const parallelUploads3 = new Upload({
      client: client,
      params: {
        Bucket: S3_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      },
      tags: [],
      queueSize: 4,
      partSize: 1024 * 1024 * 5,
      leavePartsOnError: false,
    });

    parallelUploads3.on('httpUploadProgress', (progress: any) => {
      console.log(progress);
    });

    const result = await parallelUploads3.done();

    if (!result.Bucket || !result.Key) {
      throw new Error('사진 업로드에 실패했습니다.');
    }

    const location = `https://${result.Bucket}.s3.${AWS_REGION}.amazonaws.com/${result.Key}`;

    return { ...result, Location: location } as UploadToS3Result;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('사진 업로드에 실패했습니다.');
  }
};
