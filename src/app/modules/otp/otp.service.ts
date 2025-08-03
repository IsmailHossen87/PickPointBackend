import cryto from "crypto"
import { redisclient } from "../../config/redis.config"
import { sendEmail } from "../../utils/send.Email"
const OTP_EXPIRATION = 2*60


const generateOtp =(lenght = 6)=>{
 //6 DIGIT ER OTP
 const otp = cryto.randomInt(10 ** (lenght -1), 10 ** lenght).toString()
 return otp
}



const sendOTP = async(email:string,name:string)=>{
    const otp = generateOtp()            //otp  
    const redisKey = `otp:${email}`      //unique Key
    await redisclient.set(redisKey,otp,{  // key + opt + optional value
        expiration:{
            type:"EX",
            value:OTP_EXPIRATION
        }
    })
    //OTP send use email   {Daynamic use Send Email}
    await sendEmail({
        to: email,
      subject: "Your OTP Code",
      templateName: "otp",
      templateData: {
         name:name,
         otp:otp
      }

    })
}
const verifyOTP = async()=>{
    return {}
}


export const optService ={sendOTP,verifyOTP}