// Req.file Receive from cloudinary and post data ->URL mongoose 
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";

const storage = new CloudinaryStorage({
    cloudinary :cloudinaryUpload,
    params:{
        public_id :(req,file)=>{
            const fileName = file.originalname
            .toLowerCase()
            .replace(/\s+/g,"-")   //remove empty space and replace ( - )
            .replace(/\./g,"-")    //remove DOT(.) and replace ( - )
            // eslint-disable-next-line no-useless-escape
            .replace(/[^a-z0-9\-\.]/g,"")    //remove non alpha new meric ->@#
            const extension = file.originalname.split(".").pop()
            const uniqueFileName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileName + "." + extension  //fileName.png 
            return uniqueFileName
        }
    }
})

// create a multer
export const multerUpload = multer({storage})