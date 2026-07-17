import * as z from 'zod';


export const userNameValidation = z
.string()
.min(2,"User Must have atleast 2 character")
.max(8,"User Must not have more than 8 character")
.regex(/^[a-zA-Z0-9_]+$/,"User Must not contain special character")


export const signUpSchema = z.object({
    username : userNameValidation,
    email: z.string().email({message:"The Enter Email is Invalid"}),
    password: z.string().min(6,{message:"Enter atleast 6 character of Password"}).min(8,{message:"Don't Use Password More than 8 chracter"})
})