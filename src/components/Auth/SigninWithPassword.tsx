"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { KeyRound, UserRound } from "lucide-react";
import InputGroup from "../FormElements/InputGroup";

export default function SigninWithPassword() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // تسجيل الدخول عبر NextAuth Credentials
      const result = await signIn("credentials", {
        redirect: false,
        username: formData.username,
        password: formData.password,
      });

      if (result?.ok) {
      
        router.push("/dashboard"); // أو أي صفحة محمية
      } else {
        alert(result?.error || "Invalid credentials");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup
        type="text"
        label="User Name"
        placeholder="Enter your user name"
        name="username"
        handleChange={handleChange}
        value={formData.username}
        icon={<UserRound />}
      />

      <InputGroup
        type="password"
        label="Password"
        placeholder="Enter your password"
        name="password"
        handleChange={handleChange}
        value={formData.password}
        icon={<KeyRound />}
      />

      <div className="mb-4.5">
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
        >
          Sign In
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
          )}
        </button>
      </div>
    </form>
  );
}
