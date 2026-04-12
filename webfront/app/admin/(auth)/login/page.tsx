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
import { Field, FieldLabel } from '@/components/ui/field';
import PasswordInputGroup from '@/components/inputs/password-input-group';

const AdminLogin = () => {
    return (
        <form>
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
                            required
                        />
                        <FieldLabel htmlFor="password">
                            Password <span className="text-destructive">*</span>
                        </FieldLabel>
                        <PasswordInputGroup id='password' placeholder='password' required />

                    </Field>
                </CardContent>
                <CardFooter className='flex flex-col'>
                    <Button className='w-full'>Login</Button>
                    <Button variant='outline' className='w-full mt-2'>Register</Button>
                </CardFooter>
            </Card>
        </form>
    )
}

export default AdminLogin
