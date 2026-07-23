'use client'
import { Button } from "@/src/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form"
import { Input } from "@/src/components/ui/input"
import { signUpSchema } from "@/src/schemas/signUpSchema"
import { ApiResponse } from "@/src/types/apiresponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useDebounceCallback } from 'usehooks-ts'
import Link from "next/link"
import * as z from "zod"

const Page = ()=>{
  const[username, setUsername] = useState('')
  const[usernameMessage, setUsernameMessage] = useState('')
  const[isCheckingUsername, setIsCheckingUsername] = useState(false)
  const[isSubmitting, setIsSubmitting] = useState(false)
  const debounced = useDebounceCallback(setUsername, 2000)

  const router = useRouter()
  //Zod Implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      username:'',
      email:'',
      password:''
    }
  })

useEffect(() => {
  const checkUsernameUnique = async () => {
    if (username) {
      setIsCheckingUsername(true)
      setUsernameMessage('')
      try {
        const response = await axios.get(`/api/check-username-unique?username=${username}`)
        setUsernameMessage(response.data.message)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        setUsernameMessage(
          axiosError.response?.data.message ?? 'Error checking Username'
        )
      } finally {
        setIsCheckingUsername(false)
      }
    }
  }
  checkUsernameUnique()
}, [username])

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
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Feedback Message
          </h1>
          <p className="mb-4">
            SignUp to start your anonymous Adventure
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Choose a unique username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin"/>}
                  <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}>
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Create a password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting || isCheckingUsername}>
              {isSubmitting ? (
                <>
                <Loader2  className = "mr-2 h-4 w-4 animate-spin"/>
                Please Wait
                </>
              ) : ("Sign Up")}
            </Button>

          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already Member?{' '}
            <Link href='/sign-in' className="text-blue-600 hover:text-blue-800">
            Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
export default Page