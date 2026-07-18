import { getServerSession } from "next-auth";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/models/users";
import { User } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";

export async function POST(request:Request){
    await dbConnect()
    const session = await getServerSession(authOption)
    const user:User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:'Not Authenticated'
        },{status: 401})
    }
    const UserId = user._id
    const {acceptMessages}=await request.json()
    try{
        const updatedUSer = await UserModel.findByIdAndUpdate(
            UserId,
            {isAcceptingMessage:acceptMessages},
            {new:true}
        )
        if(!updatedUSer){
            return Response.json({
            success:false,
            message:'Not Authenticated'
        },{status: 401})
        }
        return Response.json({
            success:true,
            message:'Message acceptance Update Successfully',updatedUSer
        },{status: 401})
    }catch(error){
        console.log("Failed to update user status to accept messages",error)
        return Response.json({
            success:false,
            message:'Failed to update user status to accept messages'
        },{status: 500})
    }
}

export async function  GET(request:Request) {
    await dbConnect()

    const session = await getServerSession(authOption)
    const user:User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:'Not Authenticated'
        },{status: 401})
    }
    const UserId = user._id;
    try{
        const foundUser = await UserModel.findById(UserId)
    if(!foundUser){
    return Response.json({
            success:false,
            message:'User not Found'
        })
    }
        return Response.json({
            success:false,
            isAcceptingMessages:foundUser.isAcceptingMessage
        },{status:200})
    }catch(error){
        console.log("Error in getting message acceptance status",error)
        return Response.json({
            success:false,
            message:'Error in getting message acceptance status'
        },{status: 500})
    }
}