import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  const { image, plateNumber } = await req.json();

  const result = await cloudinary.uploader.upload(image, {
    folder: "map-reports",
    public_id: `map_${plateNumber}_${Date.now()}`,
  });


  return NextResponse.json({
    url: result.secure_url,
    public_id: result.public_id, // ✅ مهم جداً
  });
}