import React from 'react';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const LoginPage = () => {
    return (
        <Card className='w-lg'>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your login details</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-3'>
                <label>Email</label>
                <Input/>
                <label>Password</label>
                <Input/>
            </CardContent>
            <CardFooter>
                <Button className='w-full'>Login</Button>
            </CardFooter>
        </Card>
    )
}

export default LoginPage
