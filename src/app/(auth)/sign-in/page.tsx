'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import {useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useDebounceValue } from 'usehooks-ts'
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/src/components/ui/button"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/src/schemas/signUpSchema"
import axios,{AxiosError} from "axios"
import { ApiResponse } from "@/src/types/apiresponse"


const Page = ()=>{
  const[username, setUsername] = useState('')
  const[usernameMessage, setUsernameMessage] = useState('')
  const[isCheckingUsername, setIsCheckingUsername] = useState(false)
  const[isSubmitting, setIsSubmitting] = useState(false)
  const debounceUsername = useDebounceValue(username,3000)

  const router = useRouter()
  //Zod Implementation
  const form = useForm({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      username:'',
      email:'',
      password:''
    }
  })

  useEffect(()=>{
    const checkUsernameUnique = async ()=>{
      if(debounceUsername){
        setIsCheckingUsername(true),
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${debounceUsername}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(
            axiosError.response?.data.message ?? 'Error checking Username'
          )
        }
        finally{
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  },[debounceUsername])

  const onSubmit = async (data:z.infer<typeof signUpSchema>)=>{
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up',data)
      toast("User Created Successfully",{
        description:response.data.message,
        position: "top-right"
      })
      router.replace(`/verify/${username}`)
      setIsSubmitting(false)
    } catch (error) {
      console.error("Error in SignUp User",error)
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message
      toast("SignUp Failed",{
        description:errorMessage,
        position: "top-right",
      })
      setIsSubmitting(false)
    }
  }
  return(
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        
      </div>
    </div>
  )
}
export default Page