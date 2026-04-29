"use client";

import { Button } from "@mantine/core";
import { RefObject } from "react";

type Props = {
  mapRef: RefObject<any>;
};

export default function MapScreenshotButton({ mapRef }: Props) {
  const takeScreenshot = () => {
    const image = mapRef.current?.getMapImage();

    if (!image) {
      alert("الخريطة غير جاهزة");
      return;
    }

    // تحميل الصورة
    const link = document.createElement("a");
    link.href = image;
    link.download = "map.png";
    link.click();
  };

  return (
    <Button
  color="blue"
 
  onClick={takeScreenshot}
>
  📸 حفظ صورة الخريطة
</Button>

  );
}