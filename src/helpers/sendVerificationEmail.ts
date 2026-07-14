import { resend } from "../lib/resend";
import {EmailTemplate}  from "../../emails/emailVerification"
import { ApiResponse } from '../types/apiresponse'


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifycode:string
):Promise<ApiResponse>{
    try {
      await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to:email,
      subject: 'Feedback Conversation | Verification Code',
      react: EmailTemplate({ username, otp:verifycode }),
    });
    return{success: true, message:"Successfully  send Verification email"}
}
     catch (emailError) {
        console.error("Error Sending Verification Email",emailError)
        return{success:false,message:"Failed to send Verification email"}
    }
}