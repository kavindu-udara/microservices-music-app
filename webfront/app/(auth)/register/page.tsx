"use client"
import React, { ChangeEvent } from 'react'
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
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import PasswordInputGroup from '@/components/inputs/password-input-group';
import { useRouter } from 'next/navigation';
import * as z from "zod";
import apiClient from '@/lib/axios';

const schema = z.object({
    firstName: z.string().regex(/^[a-zA-Z]+$/, "First name should only contain letters"),
    lastName: z.string().regex(/^[a-zA-Z]+$/, "Last name should only contain letters"),
    email: z.email().regex(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, "Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters long").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters long")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
});

type FormData = z.infer<typeof schema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

const AdminRegisterPage = () => {

    const router = useRouter();

    const [formData, setFormData] = React.useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [formErrors, setFormErrors] = React.useState<FormErrors>({});

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        const result = schema.safeParse(formData)

        if (!result.success) {
            const nextErrors: FormErrors = {}
            const flattened = result.error.flatten().fieldErrors
            for (const key of Object.keys(flattened) as Array<keyof FormData>) {
                const first = flattened[key]?.[0]
                if (first) nextErrors[key] = first
            }
            setFormErrors(nextErrors)
            return
        }

        setFormErrors({})
        console.log("valid payload:", result.data)

        apiClient.post("/auth/register", {
            firstName: result.data.firstName,
            lastName: result.data.lastName,
            email: result.data.email,
            password: result.data.password
        }).then((response) => {
            console.log("Server response:", response.data);
            // Optionally, redirect to login page or show a success message
            // router.push("/admin/login");
        }).catch((error) => {
            console.error("Error registering user:", error);
            // Optionally, set form errors based on server response
        });
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
                                    name='firstName'
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={onChange}
                                    aria-invalid={!!formErrors.firstName}
                                    required
                                />
                                <FieldError errors={formErrors.firstName ? [{ message: formErrors.firstName }] : undefined} />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="lastName">
                                    Last Name <span className="text-destructive">*</span>
                                </FieldLabel>
                                <Input
                                    id="lastName"
                                    name='lastName'
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={onChange}
                                    aria-invalid={!!formErrors.lastName}
                                    required
                                />
                                <FieldError errors={formErrors.lastName ? [{ message: formErrors.lastName }] : undefined} />
                            </Field>
                        </div>
                        <FieldLabel htmlFor="email">
                            Email <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                            id="email"
                            placeholder="john@email.com"
                            name='email'
                            value={formData.email}
                            onChange={onChange}
                            aria-invalid={!!formErrors.email}
                            required
                        />
                        <FieldError errors={formErrors.email ? [{ message: formErrors.email }] : undefined} />

                        <FieldLabel htmlFor="password">
                            Password <span className="text-destructive">*</span>
                        </FieldLabel>
                        <PasswordInputGroup
                            id='password'
                            placeholder='password'
                            name='password'
                            value={formData.password}
                            onChange={onChange}
                            ariaInvalid={!!formErrors.password} required
                        />
                        <FieldError errors={formErrors.password ? [{ message: formErrors.password }] : undefined} />

                        <FieldLabel htmlFor="confirmPassword">
                            Confirm Password <span className="text-destructive">*</span>
                        </FieldLabel>
                        <PasswordInputGroup
                            id='confirmPassword'
                            placeholder='confirm password'
                            name='confirmPassword'
                            value={formData.confirmPassword}
                            onChange={onChange}
                           ariaInvalid={!!formErrors.confirmPassword}
                            required
                        />
                        <FieldError errors={formErrors.confirmPassword ? [{ message: formErrors.confirmPassword }] : undefined} />

                    </Field>
                </CardContent>
                <CardFooter className='flex flex-col'>
                    <Button className='w-full'>Register</Button>
                    <Button type="button" variant='outline' className='w-full mt-2' onClick={() => router.push("/login")}>Login</Button>
                </CardFooter>
            </Card>
        </form>
    )
}

export default AdminRegisterPage
