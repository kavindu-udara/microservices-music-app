"use client"
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import apiClient from '@/lib/axios'
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, SubmitEventHandler, useState } from 'react';
import { toast } from 'sonner'
import * as z from 'zod';

const schema = z.object({
    name: z.string().trim().min(2, 'Genre name must be at least 2 characters long'),
    slug: z.string().trim().min(2, 'Genre slug must be at least 2 characters long'),
    description: z.string().trim().min(10, 'Genre description must be at least 10 characters long'),
});

type FormData = z.infer<typeof schema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

const CreateGenrePage = () => {

    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        slug: '',
        description: '',
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = event.target;
        setFormData((prev) => 
            ({ ...prev, [name]: value })
    );
        setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setSubmitError(null);

        const result = schema.safeParse(formData);

        if(!result.success) {
            const nextFormErrors: FormErrors = {};
            const flattenedErrors = result.error.flatten().fieldErrors;

            for (const key of Object.keys(flattenedErrors) as Array<keyof FormData>) {
                const firstError = flattenedErrors[key]?.[0];
                if (firstError) nextFormErrors[key] = firstError;
            }

            setFormErrors(nextFormErrors);
            return;

        }

        setFormErrors({});

        try {
            setIsSubmitting(true);
            await apiClient.post('/catalog/genre', formData).then((res) => {
                toast.success(res.data.message || 'Genre created successfully');
                router.push('/admin/genres');
            }).catch((error) => {
                console.error('Error creating genre:', error.response);
                setSubmitError(error.response?.data?.error || 'Failed to create genre. Please try again.');
            }).finally(() => {
                setIsSubmitting(false);
            });
        } catch (error) {
            console.error('Error creating genre:', error);
            setSubmitError('An unexpected error occurred. Please try again.');
        }finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className='flex justify-center'>
            <div className="w-2xl">
                <form onSubmit={handleSubmit}>

                    <FieldSet>
                        <FieldLegend>Create new genre</FieldLegend>
                        <FieldDescription>Enter genre details</FieldDescription>
                        <FieldGroup>
                            {/* name */}
                            <Field>
                                <FieldLabel htmlFor="name">Genre name</FieldLabel>
                                <Input
                                    id="name"
                                    name="name"
                                    autoComplete="off"
                                    placeholder="Rock"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    aria-invalid={!!formErrors.name}
                                    required
                                />
                                <FieldError errors={formErrors.name ? [{ message: formErrors.name }] : undefined} />
                            </Field>

                            {/* slug */}
                            <Field>
                                <FieldLabel htmlFor="slug">Slug</FieldLabel>
                                <Input
                                    id="slug"
                                    name="slug"
                                    autoComplete="off"
                                    placeholder="rock"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    aria-invalid={!!formErrors.slug}
                                    required
                                />
                                <FieldError
                                    errors={formErrors.slug ? [{ message: formErrors.slug }] : undefined}
                                />
                            </Field>

                            {/* description */}
                            <Field>
                                <FieldLabel htmlFor="description">Description</FieldLabel>
                                <Textarea
                                    id="description"
                                    name="description"
                                    autoComplete="off"
                                    placeholder="A genre of popular music that originated as 'rock and roll' in the United States in the late 1940s and early 1950s."
                                    value={formData.description}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    aria-invalid={!!formErrors.description}
                                    required />
                                <FieldError errors={formErrors.description ? [{ message: formErrors.description }] : undefined} />
                            </Field>

                            {/* submit err */}
                            {submitError && (
                                <Field>
                                    <FieldError>{submitError}</FieldError>
                                </Field>
                            )}

                            <Field>
                                <div className="flex gap-3">
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Creating...' : 'Create genre'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={isSubmitting}
                                        onClick={() => router.push('/admin/artists')}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </Field>

                        </FieldGroup>
                    </FieldSet>

                </form>
            </div>
        </div>
    )
}

export default CreateGenrePage
