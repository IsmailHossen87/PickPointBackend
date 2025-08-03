import nodemailer from "nodemailer"
import { envVars } from "../config/env"
import path from "path"
import ejs from "ejs"
import AppError from "../errorHalper/App.Error"
const transporter = nodemailer.createTransport({
    secure: true,
    auth: {
        user: envVars.EMAIL_SENDER.SMTP_USER,
        pass: envVars.EMAIL_SENDER.SMTP_PASS
    },
    host: envVars.EMAIL_SENDER.SMTP_HOST,
    port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
})

interface SendEmailOption {
    to: string,
    subject: string,
    templateName: string,
    templateData?: Record<string, any>,
    attachments?: {
        filename: string,
        content: Buffer | string,
        contentType: string
    }[]
}

export const sendEmail = async ({
    to, subject, attachments, templateName, templateData
}: SendEmailOption) => {

    try {
        const templatePath = path.join(__dirname, `Template/${templateName}.ejs`) //collect file path
        const html = await ejs.renderFile(templatePath, templateData)


         await transporter.sendMail({
            from: envVars.EMAIL_SENDER.SMTP_FROM,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments?.map(attachments => ({
                filename: attachments.filename,
                content: attachments.content,
                contentType: attachments.contentType
            }))
        }) 




        // console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
    } catch (error: any) {
        console.log("Email sending error", error.meseage)
        throw new AppError(401, "Email Error")
    }
}