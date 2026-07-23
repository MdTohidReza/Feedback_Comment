'use client'
import { Button } from "@/src/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form"
import { Input } from "@/src/components/ui/input"
import { signInSchema } from "@/src/schemas/signInSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import Link from "next/link"
import * as z from "zod"
import { signIn } from "next-auth/react"

const Signin = () => {
  const router = useRouter();

   const form = useForm<z.infer<typeof signInSchema>>({
      resolver:zodResolver(signInSchema),
      defaultValues:{
        identifier:'',
        password:''
      }
    })

        const onSubmit = async (data:z.infer<typeof signInSchema>)=>{
            const result = await signIn('credentials',{
              redirect: false,
              identifier : data.identifier,
              password : data.password
            })
            if(result?.error){
              toast("Login Failed",{
                description:"Incorrect Username or Password",
                position: "top-right"
               })
            }

            if(result?.url){
              router.replace('/dashboard')
            }
        }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Feedback Message
          </h1>
          <p className="mb-4">
            SignIn to start your anonymous Adventure
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            <FormField
              control={form.control}
              name="identifier"
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
                      placeholder="Enter a password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" >
              Sign in
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

export default Signin