import cryto from "crypto"
import { redisclient } from "../../config/redis.config"
import { sendEmail } from "../../utils/send.Email"
import AppError from "../../errorHalper/App.Error"
import { User } from "../user/user.model"
const OTP_EXPIRATION = 2 * 60


const generateOtp = (lenght = 6) => {
    //6 DIGIT ER OTP
    const otp = cryto.randomInt(10 ** (lenght - 1), 10 ** lenght).toString()
    return otp
}



const sendOTP = async (email: string, name: string) => {
    // valid Email send OTP
    const user = await User.findOne({ email })
    if (!user) {
        throw new AppError(404, "User not Found")
    }
    if (user?.isVerified) {
        throw new AppError(404, "Yor are already Verified")
    }



    const otp = generateOtp()            //otp  
    const redisKey = `otp:${email}`      //unique Key
    await redisclient.set(redisKey, otp, {  // key + opt + optional value
        expiration: {
            type: "EX",
            value: OTP_EXPIRATION
        }
    })
    //OTP send use email   {Daynamic use Send Email}
    await sendEmail({
        to: email,
        subject: "Your OTP Code",
        templateName: "otp",
        templateData: {
            name: name,
            otp: otp
        }

    })
}

// Check OTP and update users data
const verifyOTP = async (email: string, otp: string) => {
    // valid Email send OTP
    const user = await User.findOne({ email })
    if (!user) {
        throw new AppError(404, "User not Found")
    }
    if (user?.isVerified) {
        throw new AppError(404, "Yor are already Verified")
    }


    const redisKey = `otp:${email}`
    const saveOtp = await redisclient.get(redisKey)

    if (!saveOtp || saveOtp !== otp) {
        throw new AppError(401, "Invalid OTP")
    }

    await Promise.all([
        User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
        redisclient.del([redisKey])
    ])
}


export const otpService = { sendOTP, verifyOTP }