import Signin from "@/components/Auth/Signin";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sign in",
};
export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-dark">
      <div className="flex w-full max-w-6xl flex-col overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card xl:flex-row">
        
        <div className="flex w-full items-center justify-center p-6 xl:w-1/2 xl:p-7.5">
          <div className="custom-gradient-1 flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl px-8 py-10 text-center dark:!bg-dark-2 dark:bg-none">
            <div className="w-40 sm:w-52 xl:w-72">
              <Image
                src={"/images/logo/logo.png"}
                alt="Logo"
                width={400}
                height={200}
                className="h-auto w-full"
              />
            </div>
            <p className="mt-2 text-sm font-medium text-dark-4 dark:text-dark-6 xl:mt-1 xl:max-w-[375px]">
              Please sign in to your account by completing the necessary fields below
            </p>

            <Image
              src={"/images/grids/grid-02.svg"}
              alt="Grid"
              width={405}
              height={325}
              className="mx-auto hidden dark:opacity-30 xl:block"
            />
          </div>
        </div>

        <div className="flex w-full items-center justify-center p-4 sm:p-12.5 xl:w-1/2 xl:p-15">
          <Signin />
        </div>
      </div>
    </div>
  );
}

