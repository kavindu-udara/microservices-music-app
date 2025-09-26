"use client"
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';
import apiClient from '@/axios/apiClient';
import { validateEmail } from '@/lib/validator';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/authSlice';

type FormType = {
    email: string,
    password: string
}

const LoginPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [form, setForm] = useState<FormType>({
        email: "",
        password: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = () => {
        if (!form.email || !form.password) {
            toast.error("All fields are required");
            return
        }

        if (!validateEmail(form.email)) {
            toast.error("Invalid Email Type");
            return
        }

        dispatch(setUser(null));
        setIsLoading(true);
        apiClient.post("/auth/login", {
            email: form.email,
            password: form.password
        }).then(res => {
            setIsLoading(false);
            console.log(res);
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success("Login success");
                router.push("/songs");
                return;
            }
            toast.error(res.data.message);
        }).catch(err => {
            setIsLoading(false);
            console.error(err);
            toast.error("Something went wrong please try again later");
        });
    }

    return (
        <Card className='w-lg'>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your login details</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-3'>
                <Label>Email</Label>
                <Input type='email' name='email' value={form.email} onChange={handleInputChange} />
                <Label>Password</Label>
                <Input type='password' name='password' value={form.password} onChange={handleInputChange} />
            </CardContent>
            <CardFooter>
                <Button className='w-full' onClick={handleLogin} disabled={isLoading} >{isLoading ? "Loading..." : "Login"}</Button>
            </CardFooter>
        </Card>
    )
}

export default LoginPage
