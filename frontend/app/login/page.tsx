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
import { Label } from '@/components/ui/label';

const LoginPage = () => {
    return (
        <Card className='w-lg'>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your login details</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-3'>
                <Label>Email</Label>
                <Input type='email'/>
                <Label>Password</Label>
                <Input type='password'/>
            </CardContent>
            <CardFooter>
                <Button className='w-full'>Login</Button>
            </CardFooter>
        </Card>
    )
}

export default LoginPage
