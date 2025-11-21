// Logo.tsx
import Image from "next/image";

export function Logo({ width, height }: { width?: number; height?: number } = {}) {
  return (
    <div className="flex justify-center items-center">
      <Image
        src="/images/logo/logo(2).png"
        width={width || 130}
        height={height || 100}
        alt="syntro logo"
        role="presentation"
        quality={100}
      />    
    </div>
  );
}
