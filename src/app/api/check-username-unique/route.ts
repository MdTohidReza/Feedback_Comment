import dbConnect from "@/src/lib/dbConnect";
import UserModel from '@/src/models/users';
import{z} from "zod";
import {userNameValidation} from '@/src/schemas/signUpSchema';

const usernameQuerySchema = z.object({
    username : userNameValidation
})

export async function GET (request:Request){
    await dbConnect()

    try {
        const{searchParams}=new URL(request.url)
        const queryParams = {
            username: searchParams.get('username')
        }
        //validation
        const result = usernameQuerySchema.safeParse(queryParams)
        console.log(result)
        if(!result.success)
        {
            const usernameError =  result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message:usernameError?.length>0 ? usernameError.join(', '):'Invalid query parameters'
            },{status:400})
        }
        const {username} = result.data
        const existingUserVerified =await UserModel.findOne({username, isVerified:true})
        if(existingUserVerified){
            return Response.json({
            success:false,
            message:'Usename is already taken'
            },{status:400})
        }
            return Response.json({
            success:true,
            message:'Username is unique'
            },{status:200})
    } catch (error) {
        console.log("Error Checking for Username",error)
        return Response.json(
            {
                success:false,
                message:'Error Checking for Username'
            },{status:500}
        )
    }
}
