"use client";
import apiClient from '@/lib/axios';
import React, { useEffect, useState } from 'react'
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';
import * as z from 'zod';

type Country = {
    id: number;
    name: string;
    code: string;
}

type Artist = {
    id: number;
    name: string;
    bio: string;
    imageUrl: string;
    countryId: number;
}

const schema = z.object({
    name: z.string().trim().min(2, 'Artist name must be at least 2 characters long'),
    bio: z.string().trim().min(10, 'Bio must be at least 10 characters long'),
    imageUrl: z.url('Please enter a valid image URL'),
    countryId: z.string().min(1, 'Please select a country'),
});

type FormData = z.infer<typeof schema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

const EditArtistPage = () => {
  const router = useRouter();
  const params = useParams();
  const artistId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    bio: '',
    imageUrl: '',
    countryId: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!artistId) {
      setIsLoading(false);
      return;
    }

    Promise.all([
      apiClient.get('/catalog/countries'),
      apiClient.get(`/catalog/artist/${artistId}`),
    ]).then(([countryResponse, artistResponse]) => {
      const fetchedArtist = artistResponse.data.artist as Artist;
      setCountries(countryResponse.data.countries ?? []);
      setFormData({
        name: fetchedArtist.name,
        bio: fetchedArtist.bio,
        imageUrl: fetchedArtist.imageUrl,
        countryId: String(fetchedArtist.countryId),
      });
    }).catch((error) => {
      console.error('Error fetching edit artist data:', error);
      toast.error('Failed to load artist details. Please try again.');
    }).finally(() => {
      setIsLoading(false);
    });
  }, [artistId]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    const result = schema.safeParse(formData);

    if (!result.success) {
      const nextErrors: FormErrors = {};
      const flattened = result.error.flatten().fieldErrors;

      for (const key of Object.keys(flattened) as Array<keyof FormData>) {
        const first = flattened[key]?.[0];
        if (first) nextErrors[key] = first;
      }

      setFormErrors(nextErrors);
      return;
    }

    if (!artistId) {
      const message = 'Artist id is missing.';
      setSubmitError(message);
      toast.error(message);
      return;
    }

    setFormErrors({});

    try {
      setIsSubmitting(true);
      await apiClient.put(`/catalog/artist/${artistId}`, {
        name: result.data.name,
        bio: result.data.bio,
        imageUrl: result.data.imageUrl,
        conuntryId: Number(result.data.countryId),
      });

      toast.success('Artist updated successfully.');
      router.push(`/admin/artists/${artistId}`);
    } catch (error) {
        console.error('Error updating artist:', error);
      console.error('Error updating artist:', error);

      const backendMessage = axios.isAxiosError(error)
        ? error.response?.data?.error
        : null;

      const friendlyMessage = backendMessage?.toLowerCase().includes('same name and country')
        ? 'An artist with this name already exists for the selected country.'
        : backendMessage || 'Failed to update artist. Please try again.';

      toast.error(friendlyMessage);
      setSubmitError(friendlyMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className='p-5 text-muted-foreground'>Loading artist details...</div>;
  }

  if (!artistId) {
    return <div className='p-5 text-destructive'>Artist id is missing.</div>;
  }

  return (
    <div className="flex justify-center p-5">
      <div className="w-2xl">
        <form onSubmit={handleSubmit}>
          <FieldSet>
            <FieldLegend>Edit artist</FieldLegend>
            <FieldDescription>Update artist details</FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Artist name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  autoComplete="off"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  aria-invalid={!!formErrors.name}
                  required
                />
                <FieldError errors={formErrors.name ? [{ message: formErrors.name }] : undefined} />
              </Field>

              <Field>
                <FieldLabel htmlFor="bio">Bio</FieldLabel>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  aria-invalid={!!formErrors.bio}
                  required
                />
                <FieldError errors={formErrors.bio ? [{ message: formErrors.bio }] : undefined} />
              </Field>

              <Field>
                <FieldLabel htmlFor="imageUrl">Image URL</FieldLabel>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  aria-invalid={!!formErrors.imageUrl}
                  required
                />
                <FieldError errors={formErrors.imageUrl ? [{ message: formErrors.imageUrl }] : undefined} />
              </Field>

              <Field>
                <FieldLabel htmlFor="countryId">Country</FieldLabel>
                <select
                  id="countryId"
                  name="countryId"
                  value={formData.countryId}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  aria-invalid={!!formErrors.countryId}
                  required
                  className="h-9 w-full rounded-4xl border border-input bg-input/30 px-3 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name} ({country.code})
                    </option>
                  ))}
                </select>
                <FieldError errors={formErrors.countryId ? [{ message: formErrors.countryId }] : undefined} />
              </Field>

              {submitError && (
                <Field>
                  <FieldError>{submitError}</FieldError>
                </Field>
              )}

              <Field>
                <div className="flex gap-3">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save changes'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={() => router.push(`/admin/artists/${artistId}`)}
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

export default EditArtistPage
