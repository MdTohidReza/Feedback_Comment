import UserModel from "@/src/models/users";
import dbConnect from "@/src/lib/dbConnect";
import {Message} from "@/src/models/users"

export async function POST(request:Request){
    await dbConnect()
    const {username,content} = await request.json()
    try{
        const user = await UserModel.findOne(username)
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404})
        }
        if(!user.isAcceptingMessage){
             return Response.json({
                success:false,
                message:"User Not Accepting Messages"
             },{status:403})
        }
        const newMessage = {content, CreatedAt:new Date()}
        user.messages.push((newMessage as Message))

        return Response.json({
            success:true,
            message:"Message Send Successfully"
        },{status:201})
    }catch(error){
        console.log("Error Adding Message",error)
        return Response.json({
            success:false,
            message:"internal server error"
        },{status:500})
    }
}