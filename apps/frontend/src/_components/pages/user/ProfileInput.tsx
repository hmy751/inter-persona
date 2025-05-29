'use client';

import {
  useState,
  useRef,
  ChangeEvent,
  DragEvent,
  useEffect,
  forwardRef,
  useCallback,
  MutableRefObject,
  InputHTMLAttributes,
  createContext,
  useMemo,
  useContext,
} from 'react';
import Avatar from '@repo/ui/Avatar';
import styles from './ProfileInput.module.css';
import Text from '@repo/ui/Text';
import { urlToFile } from '@/_libs/utils';
import { DEFAULT_PROFILE_IMAGE_NAME, DEFAULT_PROFILE_IMAGE_URL } from '@repo/constant/name';

export const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 16V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 11L12 8L15 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M20 16.7428C21.2215 16.1862 22 14.9194 22 13.5C22 11.567 20.433 10 18.5 10C18.2815 10 18.0771 10.0194 17.8836 10.0564C17.1884 7.7201 15.043 6 12.5 6C9.46243 6 7 8.46243 7 11.5C7 11.8254 7.02871 12.1423 7.08296 12.4492C5.26814 12.8373 4 14.4588 4 16.3636C4 18.5305 5.74939 20.3201 7.90901 20.3201H14.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const validationProfile = (file: File) => {
  if (!file) {
    return { isValid: false, message: '파일이 존재하지 않습니다.' };
  }

  if (!file.type.startsWith('image/')) {
    return { isValid: false, message: '이미지 형식이 아닙니다.' };
  }

  const fileSizeInMB = file.size / (1024 * 1024);

  const MAX_SIZE_IN_MB = 5;

  if (fileSizeInMB > MAX_SIZE_IN_MB) {
    return { isValid: false, message: '파일 용량이 너무 큽니다. 5mb이하로 변경해주세요.' };
  }

  return { isValid: true };
};

interface ProfileInputContextValue {
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  previewUrl: string;
  rootInputRef: MutableRefObject<HTMLInputElement | null>;
  handlePreviewUrl: (arg: File) => void;
  onChangeFile: (arg: File) => void;
}

const ProfileInputContext = createContext<ProfileInputContextValue>({} as ProfileInputContextValue);

interface RootProps extends React.PropsWithChildren {
  defaultImageUrl?: string;
  onChangeFile: (arg: File) => void;
  size: 'lg' | 'xl';
}

const Root = ({ defaultImageUrl = DEFAULT_PROFILE_IMAGE_URL, children, size, onChangeFile }: RootProps) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string>(defaultImageUrl);
  const rootInputRef = useRef<HTMLInputElement | null>(null);

  const handlePreviewUrl = useCallback(
    (file: File) => {
      if (!file) {
        return;
      }

      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }

      const newPreviewUrl = URL.createObjectURL(file);

      setPreviewUrl(newPreviewUrl);
    },
    [previewUrl]
  );

  const contextValue = useMemo(
    () => ({
      isDragging,
      setIsDragging,
      previewUrl,
      rootInputRef,
      handlePreviewUrl,
      onChangeFile,
    }),
    [isDragging, setIsDragging, previewUrl, rootInputRef, handlePreviewUrl, onChangeFile]
  );

  useEffect(() => {
    if (defaultImageUrl) {
      urlToFile(defaultImageUrl, DEFAULT_PROFILE_IMAGE_NAME, 'image/png').then(file => {
        onChangeFile(file);
      });
    }

    return () => {};
  }, [defaultImageUrl]);

  return (
    <ProfileInputContext.Provider value={contextValue}>
      <div
        className={`
        ${styles.imageInputContainer} 
        ${styles[`size-${size}`]} 
        ${isDragging ? styles.dragging : ''}
      `}
        tabIndex={0}
      >
        {children}
        <Text size="sm" color="secondary">
          {isDragging ? '이미지를 놓아주세요' : '클릭 또는 드래그하여 이미지를 업로드 해주세요'}
        </Text>
      </div>
    </ProfileInputContext.Provider>
  );
};

Root.displayName = 'ProfileInput.Root';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  acceptedFormats?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ acceptedFormats = 'image/jpeg, image/png, image/jpg', ...restProps }, ref) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const { rootInputRef, handlePreviewUrl, onChangeFile } = useContext(ProfileInputContext);

    const assignRef = useCallback(
      (element: HTMLInputElement) => {
        if (element) {
          (internalRef as MutableRefObject<HTMLInputElement>).current = element;
          rootInputRef.current = element;
        }

        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          (ref as MutableRefObject<HTMLInputElement>).current = element;
        }
      },
      [ref, internalRef]
    );

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();

      if (e.target?.files && e.target.files?.length > 0) {
        const file = e.target.files[0]!;

        const { isValid } = validationProfile(file);

        if (!isValid) {
          return;
        }

        handlePreviewUrl(file);
        onChangeFile(file);
      }
    };

    return (
      <input
        ref={assignRef}
        type="file"
        onChange={handleChangeInput}
        accept={acceptedFormats}
        className={styles.hiddenInput}
        aria-label="프로필 이미지 선택"
        {...restProps}
      />
    );
  }
);

Input.displayName = 'ProfileInput.Input';

interface PreviewProps {
  size: 'lg' | 'xl';
}

const Preview = ({ size }: PreviewProps) => {
  const { isDragging, setIsDragging, previewUrl, rootInputRef, onChangeFile, handlePreviewUrl } =
    useContext(ProfileInputContext);

  const handleDragEnter = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.preventDefault();

      setIsDragging(true);
    },
    [setIsDragging]
  );

  const handleDragLeave = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.preventDefault();

      setIsDragging(false);
    },
    [setIsDragging]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.preventDefault();

      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0] as File;

        const { isValid } = validationProfile(file);

        if (!isValid) {
          return;
        }

        handlePreviewUrl(file);
        onChangeFile(file);
      }
    },
    [handlePreviewUrl, setIsDragging, rootInputRef.current, onChangeFile]
  );

  const handleSelectClick = useCallback(() => {
    rootInputRef.current?.click();
  }, [rootInputRef]);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <div
      className={styles.avatarContainer}
      onClick={handleSelectClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Avatar
        src={previewUrl}
        size={size}
        alt="프로필 이미지"
        className={`${styles.avatar} ${isDragging ? styles.draggingAvatar : ''}`}
      />
      <div className={styles.uploadOverlay}>
        <div className={styles.uploadIcon}>
          <UploadIcon />
        </div>
      </div>
    </div>
  );
};

Preview.displayName = 'ProfileInput.Preview';

const ProfileInput = Object.assign(Root, {
  Input,
  Preview,
});

export default ProfileInput;
