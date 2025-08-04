// Cloudinary হলো একটি cloud-based media management service — যার মাধ্যমে তুমি image, video, এবং অন্যান্য media file upload, store, transform, optimize, এবং deliver করতে পারো খুব সহজে।

import { v2 as cloudinary, UploadApiErrorResponse } from "cloudinary";
import { envVars } from "./env";
import AppError from "../errorHalper/App.Error";
import Stream from "stream"

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

// PDF UPLOAD
export const uploadBufferCloudinary = async (buffer: Buffer, fileName: string):Promise<UploadApiErrorResponse | undefined>  => {
  try {
    return new Promise((resolve, reject) => {
      const public_id = `pdf/${fileName}-${Date.now()}`

      const bufferStream = new Stream.PassThrough()
      bufferStream.end(buffer)

      cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          public_id: public_id,
          folder: "pdf"
        }, (error, result) => {
          if (error) {
            return reject(error)
          }
          resolve(result)
        }
      ).end(buffer)
    })
  } catch (error: any) {
    console.log(error)
    throw new AppError(401, `Error uploading file ${error.message}`)
  }
}