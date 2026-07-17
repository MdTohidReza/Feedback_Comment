import UserModel from "@/src/models/users";
import dbConnect from "@/src/lib/dbConnect";

export async function POST(request:Request){
    await dbConnect();


    try {
        const{username,code} = await request.json()
        const decodeUser = decodeURIComponent(username)
        const user =await UserModel.findOne({username:decodeUser})
        if(!user){
            return Response.json({
                success:false,
                message:'User not found'
            })
        }
        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
        if(isCodeValid && isCodeNotExpired){
                user.isVerified = true
                await user.save()
                return Response.json({
                success:true,
                message:'User is Verified'
            })
        }else if(!isCodeNotExpired){
            return Response.json({
                success:false,
                message:'Sorry,Your code is expired, Please sign-in again to get new code'
            })
        }else{
            return Response.json({
                success:false,
                message:'The Entered Code is Incorrect'
            })
        }
    } catch (error) {
        console.log("Error Verifying User",error)
        return Response.json({
            success:false,
            message:'Error Verifying User'
        })
    }
}