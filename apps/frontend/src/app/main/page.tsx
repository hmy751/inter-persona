"use client";

import styles from "./page.module.css";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/useUserStore";
import { fetchLogin } from "@/apis/user";

export default function MainPage() {
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
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formContent}>
          <h1 className={styles.title}>면접 시작하기</h1>

          <div className={styles.inputGroup}>
            <label className={styles.label}>이름</label>
            <input
              type="text"
              name="name"
              className={styles.input}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>이메일</label>
            <input
              type="email"
              name="email"
              className={styles.input}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <button type="submit" className={styles.button}>
            시작하기
          </button>
        </div>
      </form>
    </div>
  );
}
