import React from 'react'
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

const page = () => {
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
                    <Input type='text' />
                    <Input type='text' />
                </div>
                <Label>Email</Label>
                <Input type='email' />
                <Label>Password</Label>
                <Input type='password' />
                <Label>Comfirm Password</Label>
                <Input />
            </CardContent>
            <CardFooter>
                <Button className='w-full'>Register</Button>
            </CardFooter>
        </Card>
    )
}

export default page
