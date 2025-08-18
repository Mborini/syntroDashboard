import Signin from "@/components/Auth/Signin";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-dark">
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card flex w-full max-w-6xl overflow-hidden">
        {/* Form Side */}
        <div className="w-full xl:w-1/2 p-4 sm:p-12.5 xl:p-15 flex items-center justify-center">
          <Signin />
        </div>

        {/* Graphic Side */}
        <div className="hidden xl:flex w-1/2 p-7.5">
          <div className="custom-gradient-1 overflow-hidden rounded-2xl px-12.5 pt-12.5 dark:!bg-dark-2 dark:bg-none flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-5 mb-4">
              <Image
                src={"/images/logo/logo.png"}
                alt="Logo"
                width={176}
                height={32}
              />
              <h1 className="text-2xl font-bold text-dark dark:text-white sm:text-heading-3">
                Welcome
              </h1>
            </div>
            <p className="w-full max-w-[375px] font-medium text-dark-4 dark:text-dark-6 mb-6">
              Please sign in to your account by completing the necessary fields below
            </p>
            <Image
              src={"/images/grids/grid-02.svg"}
              alt="Logo"
              width={405}
              height={325}
              className="mx-auto dark:opacity-30"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
