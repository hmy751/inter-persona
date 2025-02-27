"use client";

import { useState, useRef, ChangeEvent, DragEvent, useEffect } from "react";
import Avatar from "@repo/ui/Avatar";
import styles from "./ProfileInput.module.css";
import Text from "@repo/ui/Text";
import { urlToFile } from "@/_libs/utils";

export const UploadIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 16V8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 11L12 8L15 11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 16.7428C21.2215 16.1862 22 14.9194 22 13.5C22 11.567 20.433 10 18.5 10C18.2815 10 18.0771 10.0194 17.8836 10.0564C17.1884 7.7201 15.043 6 12.5 6C9.46243 6 7 8.46243 7 11.5C7 11.8254 7.02871 12.1423 7.08296 12.4492C5.26814 12.8373 4 14.4588 4 16.3636C4 18.5305 5.74939 20.3201 7.90901 20.3201H14.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface ProfileInputProps {
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
  defaultImageUrl?: string;
  size?: "lg" | "xl";
  maxSizeInMB?: number;
  acceptedFormats?: string;
  className?: string;
  onValidate?: (file: File | null) => string | undefined;
  error?: string;
}

export default function ProfileInput({
  setImage,
  error,
  defaultImageUrl = "/assets/images/dev_profile.png",
  size = "xl",
  maxSizeInMB = 5,
  acceptedFormats = "image/jpeg, image/png, image/jpg",
  className,
  onValidate,
}: ProfileInputProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    defaultImageUrl || null
  );
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [internalError, setInternalError] = useState<string | undefined>(error);

  useEffect(() => {
    setInternalError(error);
  }, [error]);

  useEffect(() => {
    if (defaultImageUrl) {
      setPreviewUrl(defaultImageUrl);
      urlToFile(defaultImageUrl, "default", "image/png").then((file) => {
        setImage(file);
      });
    }

    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [defaultImageUrl]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleFile(file);
  };

  const handleFile = (file: File | null) => {
    if (file && onValidate) {
      const validationError = onValidate(file);
      setInternalError(validationError);
    }

    if (!file) {
      setImage(null);
      setPreviewUrl(defaultImageUrl || null);
      return;
    }

    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > (maxSizeInMB || 5)) {
      setImage(file);
      return;
    }

    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(newPreviewUrl);
    setImage(file);
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]!;
      handleFile(file);
    }
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`
        ${styles.imageInputContainer} 
        ${styles[`size-${size}`]} 
        ${isDragging ? styles.dragging : ""}
        ${className || ""}
      `}
      tabIndex={0}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedFormats}
        className={styles.hiddenInput}
        aria-label="프로필 이미지 선택"
      />
      <div
        className={styles.avatarContainer}
        onClick={handleSelectClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Avatar
          src={previewUrl || defaultImageUrl}
          size={size}
          alt="프로필 이미지"
          className={`${styles.avatar} ${isDragging ? styles.draggingAvatar : ""}`}
        />
        <div className={styles.uploadOverlay}>
          <div className={styles.uploadIcon}>
            <UploadIcon />
          </div>
        </div>
      </div>
      <Text size="sm" color="secondary">
        {isDragging
          ? "이미지를 놓아주세요"
          : "클릭 또는 드래그하여 이미지를 업로드 해주세요"}
      </Text>
    </div>
  );
}
