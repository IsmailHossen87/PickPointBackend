// ✅ Cloudinary এবং প্রয়োজনীয় কনফিগারেশন সেটআপের জন্য ফাইল

import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";
import AppError from "../errorHalper/App.Error";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_SECRET,
});

// ✅ Export cloudinary object for use in other files (upload etc.)
export const cloudinaryUpload = cloudinary;


/**
 * Cloudinary থেকে পুরাতন/অপ্রয়োজনীয় ইমেজ ডিলিট করার ফাংশন।
 *
 * @param url - যেই ইমেজের URL দেওয়া আছে সেটি থেকে public_id বের করে ডিলিট করা হবে
 */
export const deleteImageFromCloudinary = async (url: string) => {
  try {
    // ✅ Example URL: https://res.cloudinary.com/your_cloud_name/image/upload/v1692371823/folder1/image1.jpg
    // ⬇️ regex দিয়ে "folder1/image1" এই অংশ (public_id) বের করা হবে 

    const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
    const match = url.match(regex);

    // ✅ যদি public_id পাওয়া যায়
    if (match && match[1]) {
      const public_id = match[1];

      // Cloudinary থেকে ইমেজ ডিলিট করা হবে
      await cloudinary.uploader.destroy(public_id);
    }

  } catch (error: any) {
    // যদি কোনো সমস্যা হয় তাহলে কাস্টম error throw করা হবে
    throw new AppError(401, "Cloudinary image deletion failed", error.message);
  }
};
