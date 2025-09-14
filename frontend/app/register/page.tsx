import React from 'react'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const page = () => {
    return (
        <Card className='w-lg'>
            <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>Enter your details</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-3'>
                <div className='grid grid-cols-2 gap-3'>
                    <label>First Name</label>
                    <label>Last Name</label>
                    <Input type='text' />
                    <Input type='text' />
                </div>
                <label>Email</label>
                <Input type='email' />
                <label>Password</label>
                <Input type='password' />
                <label>Comfirm Password</label>
                <Input />
            </CardContent>
            <CardFooter>
                <Button className='w-full'>Register</Button>
            </CardFooter>
        </Card>
    )
}

export default page
