"use client"
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
import React, { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";

const schema = z.object({
    email: z.email().regex(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, "Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters long").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
});

type FormData = z.infer<typeof schema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

const AdminLogin = () => {

    const router = useRouter();

    const [formData, setFormData] = React.useState<FormData>({
        email: '',
        password: ''
    });
    const [formErrors, setFormErrors] = React.useState<FormErrors>({});

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

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

        // TODO: send the valid payload to the server and handle the response accordingly
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card className='w-xl'>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter login details</CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col'>
                    <Field>
                        <FieldLabel htmlFor="email">
                            Email <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                            id="email"
                            placeholder="john@email.com"
                            type="email"
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
                            ariaInvalid={!!formErrors.password}
                            required
                        />
                        <FieldError errors={formErrors.password ? [{ message: formErrors.password }] : undefined} />

                    </Field>
                </CardContent>
                <CardFooter className='flex flex-col'>
                    <Button className='w-full'>Login</Button>
                    <Button type="button" variant='outline' className='w-full mt-2' onClick={() => router.push("/register")}>Register</Button>
                </CardFooter>
            </Card>
        </form>
    )
}

export default AdminLogin
