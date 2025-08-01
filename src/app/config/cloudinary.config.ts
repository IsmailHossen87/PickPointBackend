import { v2 as clodinary } from "cloudinary";
import { envVars } from "./env";
import AppError from "../errorHalper/App.Error";

// Its collect data frontend and Receive
clodinary.config({
    cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY.CLOUDINARY_SECRET
})
// create a storage (multer-storage-cloudinary) this component -> UPLOAD image the storage and give a ->  url (req.file)  -> upload mongoose




// delete unNecessary image from Cloudinary
export const deleteImageFromCloudinary = async (url: string) => {

    try {
        //v1692371823/folder1/image1.jpg 
        const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;      //search public_id
        const match = url.match(regex)
        if (match && match[1]) {
            const public_id = match[1]
            await cloudinaryUpload.uploader.destroy(public_id)
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new AppError(401, "Coudinary image deletion failed", error.message)
    }
}
export const cloudinaryUpload = clodinary;