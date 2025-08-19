"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { KeyRound, UserRound, Eye, EyeOff } from "lucide-react";
import InputGroup from "@/components/FormElements/InputGroup";

export default function SigninWithPassword() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        username: formData.username,
        password: formData.password,
      });

      if (result?.ok) {
        router.push("/dashboard");
      } else {
        alert(result?.error || "Invalid credentials");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-md mx-auto custom-gradient-1 pr-6 pt-6 pb-6 pl-6 rounded-xl"   style={{
    backgroundImage: "url('/images/grids/grid-02.svg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
      {/* Username Field */}
      <div className="w-full">
        <InputGroup
          type="text"
          label="User Name"
          placeholder="Enter your user name"
          name="username"
          handleChange={handleChange}
          value={formData.username}
          icon={<UserRound />}
          className="w-full"
        />
      </div>

      {/* Password Field appears automatically after username */}
      <div
        className={`transition-opacity duration-500 ${
          formData.username ? "opacity-100 mt-2" : "opacity-0 pointer-events-none"
        }`}
      >
        <InputGroup
          type={showPassword ? "text" : "password"}
          label="Password"
          placeholder="Enter your password"
          name="password"
          handleChange={handleChange}
          value={formData.password}
          icon={
            <div onClick={() => setShowPassword(!showPassword)} className="cursor-pointer">
              {showPassword ? <EyeOff /> : <Eye />}
            </div>
          }
          className="w-full"
        />
      </div>

      {/* Submit Button */}
      <div
        className={`transition-opacity duration-500 ${
          formData.username ? "opacity-100 mt-4" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white hover:bg-opacity-90 transition"
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
