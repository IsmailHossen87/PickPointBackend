import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";


const storage = new CloudinaryStorage({
    cloudinary: cloudinaryUpload,
    params: {
        public_id: (req, file) => {
            const fileName = file.originalname
                .toLowerCase()
                .replace(/\s+/g, "-") // empty space remove replace with dash
                .replace(/\./g, "-")  // dot(.) remove replace with dash
                
                // eslint-disable-next-line no-useless-escape
                .replace(/[^a-z0-9\-\.]/g, "") // non alpha numeric - !@#$

            const extension = file.originalname.split(".").pop()

            // extension → file এর extension আলাদা করে
            // uniqueFileName → random string + timestamp + original নাম + extension → একটা unique নাম তৈরি করে
            const uniqueFileName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileName + "." + extension

            return uniqueFileName
        }
    }
})

export const multerUpload = multer({ storage: storage })