"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, UserRound } from "lucide-react";
import { Button, TextInput } from "@mantine/core";

export default function SigninWithPassword() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    sessionValue: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        username: formData.username,
        password: formData.password,
        sessionValue: formData.sessionValue, // ✅ مهم
      });

      if (!res?.ok) {
        alert("بيانات الدخول غير صحيحة");
        return;
      }

      router.push("/dashboard");
    } catch {
      alert("حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      dir="rtl"
      className="custom-gradient-1 mx-auto w-full max-w-md space-y-4 rounded-xl p-6"
      style={{
        backgroundImage: "url('/images/grids/grid-02.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <TextInput
        label="اسم المستخدم"
        placeholder="أدخل اسم المستخدم"
        name="username"
        value={formData.username}
        onChange={handleChange}
        leftSection={<UserRound size={16} />}
        radius="md"
        required
      />

      <TextInput
        type={showPassword ? "text" : "password"}
        label="كلمة المرور"
        placeholder="أدخل كلمة المرور"
        name="password"
        value={formData.password}
        onChange={handleChange}
        leftSection={
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="cursor-pointer"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </span>
        }
        radius="md"
        required
      />

      <TextInput
        label="Session"
        placeholder="أدخل السيشن"
        name="sessionValue"
        value={formData.sessionValue}
        onChange={handleChange}
        radius="md"
        required
      />

      <Button
        type="submit"
        fullWidth
        loading={loading}
        disabled={!formData.sessionValue}
      >
        تسجيل الدخول
      </Button>
    </form>
  );
}