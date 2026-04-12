"use client"
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import PasswordInputGroup from '@/components/inputs/password-input-group';
import { useRouter } from 'next/navigation';

const AdminRegisterPage = () => {

    const router = useRouter();

    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Handle form submission logic here
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card className='w-xl'>
                <CardHeader>
                    <CardTitle>Regiser</CardTitle>
                    <CardDescription>Enter your details</CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col'>
                    <Field>
                        <div className='grid grid-cols-2 gap-5'>
                            <Field>
                                <FieldLabel htmlFor="firstName">
                                    First Name <span className="text-destructive">*</span>
                                </FieldLabel>
                                <Input
                                    id="firstName"
                                    placeholder="John"
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="lastName">
                                    Last Name <span className="text-destructive">*</span>
                                </FieldLabel>
                                <Input
                                    id="lastName"
                                    placeholder="Doe"
                                    required
                                />
                            </Field>
                        </div>
                        <FieldLabel htmlFor="email">
                            Email <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                            id="email"
                            placeholder="john@email.com"
                            required
                        />
                        <FieldLabel htmlFor="password">
                            Password <span className="text-destructive">*</span>
                        </FieldLabel>
                        <PasswordInputGroup id='password' placeholder='password' required />
                        <FieldLabel htmlFor="confirmPassword">
                            Confirm Password <span className="text-destructive">*</span>
                        </FieldLabel>
                        <PasswordInputGroup id='confirmPassword' placeholder='confirm password' required />
                    </Field>
                </CardContent>
                <CardFooter className='flex flex-col'>
                    <Button className='w-full'>Register</Button>
                    <Button type="button" variant='outline' className='w-full mt-2' onClick={() => router.push("/admin/login")}>Login</Button>
                </CardFooter>
            </Card>
        </form>
    )
}

export default AdminRegisterPage
