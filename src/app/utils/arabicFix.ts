import reshape from "arabic-persian-reshaper";
import bidi from "bidi-js";

export const fixArabic = (text: string) => {
  if (!text) return "";

  const reshaped = reshape.convertArabic(text);
  return bidi.getVisualString(reshaped);
};