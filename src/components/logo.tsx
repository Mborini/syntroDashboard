import darkLogo from "@/assets/logos/dark.svg";
import Image from "next/image";

export function Logo() {
  return (
    <div className="relative h-14 max-w-[10.847rem]">
      <Image
        src={"/images/logo/logo1.png"}
        width={176}
        height={32}
        className="dark:hidden"
        alt="NextAdmin logo"
        role="presentation"
        quality={100}
       
      />

      <Image
        src={"/images/logo/logo1.png"}
        fill
        className="hidden dark:block"
        alt="NextAdmin logo"
        role="presentation"
        quality={100}
      />
    </div>
  );
}
