"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { fetchLogin } from "@/_apis/user";
import { useRouter } from "next/navigation";
import InputField from "@repo/ui/InputField";
import Input from "@repo/ui/Input";
import Button from "@repo/ui/Button";
import styles from "./FormSection.module.css";
import useUserStore from "@/_store/zustand/useUserStore";

export default function FormSection() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    imageSrc: "",
  });

  const loginMutation = useMutation({
    mutationFn: fetchLogin,
    onSuccess: (data) => {
      if (!data) return;
      setUser(data);
      router.push("/interviewer");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <form className={styles.form}>
      {/* <div className={styles.inputGroup}>
    <label className={styles.label}>이름</label>
    <input
      type="text"
      name="name"
      className={styles.input}
      value={formData.name}
      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    />
  </div> */}
      <InputField label="이름">
        <Input
          placeholder="Enter Text..."
          // isFocused={isFocused}
          // isTouched={isTouched}
          // onFocusChange={setIsFocused}
          // onTouchChange={setIsTouched}
        />
      </InputField>

      {/* <div className={styles.inputGroup}>
    <label className={styles.label}>이메일</label>
    <input
      type="email"
      name="email"
      className={styles.input}
      value={formData.email}
      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    />
  </div> */}
      <InputField label="이메일">
        <Input
          placeholder="Enter Text..."
          // isFocused={isFocused}
          // isTouched={isTouched}
          // onFocusChange={setIsFocused}
          // onTouchChange={setIsTouched}
        />
      </InputField>

      <Button variant="primary" fullWidth type="submit">
        시작하기
      </Button>
    </form>
  );
}
