"use client"
import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'
import { validateEmail } from '@/lib/validator'
import apiClient from '@/axios/apiClient'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type FormType = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string
}

const page = () => {

    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [form, setForm] = useState<FormType>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = () => {

        if (!form.email || !form.confirmPassword || !form.firstName || !form.lastName || !form.password) {
            toast.error("All fields are required");
            return;
        }

        if (!validateEmail(form.email)) {
            toast.error("Invalid Email Type");
            return
        }

        if (form.password !== form.confirmPassword) {
            toast.error("Passwords doesnt match")
            return;
        }

        setIsLoading(true);
        apiClient.post("/auth/register", {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            password: form.password
        }).then(res => {
            console.log(res);
            setIsLoading(false);
            if (res.data.success) {
                toast.success("Account created");
                router.push("/");
                return;
            }
            toast.error(res.data.message);
        }).catch(err => {
            console.error(err);
            toast.error("Something went wrong");
            setIsLoading(false);
        })
    }

    return (
        <Card className='w-lg'>
            <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>Enter your details</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-3'>
                <div className='grid grid-cols-2 gap-3'>
                    <Label>First Name</Label>
                    <Label>Last Name</Label>
                    <Input type='text' name='firstName' value={form.firstName} onChange={handleInputChange} />
                    <Input type='text' name='lastName' value={form.lastName} onChange={handleInputChange} />
                </div>
                <Label>Email</Label>
                <Input type='email' name='email' value={form.email} onChange={handleInputChange} />
                <Label>Password</Label>
                <Input type='password' name='password' value={form.password} onChange={handleInputChange} />
                <Label>Comfirm Password</Label>
                <Input type='password' name='confirmPassword' value={form.confirmPassword} onChange={handleInputChange} />
            </CardContent>
            <CardFooter className='flex flex-col gap-3'>
                <Button onClick={handleRegister} className='w-full' disabled={isLoading}>{isLoading ? "Loading..." : "Register"}</Button>

                <Link href={"/login"} className='text-gray-600'>Already have an account ?</Link>

            </CardFooter>
        </Card>
    )
}

export default page
