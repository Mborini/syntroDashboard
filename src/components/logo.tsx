// Logo.tsx
import Image from "next/image";

export function Logo() {
  return (
    <div className="flex justify-center items-center">
      <Image
        src="/images/logo/logo.png"
        width={130}
        height={50}
        alt="syntro logo"
        role="presentation"
        quality={100}
      />    
    </div>
  );
}
