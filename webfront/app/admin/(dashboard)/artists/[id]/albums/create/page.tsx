"use client";
import apiClient from '@/lib/axios';
import React, { useEffect, useMemo, useState } from 'react'
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
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';
import * as z from 'zod';

const schema = z.object({
  title: z.string().trim().min(2, 'Album title must be at least 2 characters long'),
  releaseDate: z.string().min(1, 'Release date is required'),
  coverUrl: z.url('Please enter a valid cover image URL'),
});

type FormData = z.infer<typeof schema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

const ArtistAlbumCreatePage = () => {
  const router = useRouter();
  const params = useParams();

  const artistId = useMemo(() => {
    const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
    return Number(rawId);
  }, [params.id]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [artistName, setArtistName] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    releaseDate: '',
    coverUrl: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!artistId || Number.isNaN(artistId)) return;

    apiClient
      .get(`/catalog/artist/${artistId}`)
      .then((response) => {
        setArtistName(response.data.artist?.name || 'Unknown artist');
      })
      .catch((error) => {
        console.error('Error fetching artist details:', error);
        setArtistName('Unknown artist');
      });
  }, [artistId]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!artistId || Number.isNaN(artistId)) {
      const message = 'Invalid artist id.';
      toast.error(message);
      setSubmitError(message);
      return;
    }

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

    setFormErrors({});

    try {
      setIsSubmitting(true);
      await apiClient.post('/catalog/album', {
        title: result.data.title,
        artistId,
        releaseDate: result.data.releaseDate,
        coverUrl: result.data.coverUrl,
      });

      toast.success('Album created successfully.');
      router.push(`/admin/artists/${artistId}`);
    } catch (error) {
      console.error('Error creating album:', error);

      const backendMessage = axios.isAxiosError(error)
        ? error.response?.data?.error
        : null;

      const friendlyMessage = backendMessage?.toLowerCase().includes('same title')
        ? 'An album with this title already exists for this artist.'
        : backendMessage || 'Failed to create album. Please try again.';

      toast.error(friendlyMessage);
      setSubmitError(friendlyMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center p-5">
      <div className="w-2xl">
        <form onSubmit={handleSubmit}>
          <FieldSet>
            <FieldLegend>Create new album</FieldLegend>
            <FieldDescription>
              Enter album details for {artistName || 'selected artist'}
            </FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Album title</FieldLabel>
                <Input
                  id="title"
                  name="title"
                  autoComplete="off"
                  placeholder="Greatest Hits"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  aria-invalid={!!formErrors.title}
                  required
                />
                <FieldError errors={formErrors.title ? [{ message: formErrors.title }] : undefined} />
              </Field>

              <Field>
                <FieldLabel htmlFor="releaseDate">Release date</FieldLabel>
                <Input
                  id="releaseDate"
                  name="releaseDate"
                  type="date"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  aria-invalid={!!formErrors.releaseDate}
                  required
                />
                <FieldError errors={formErrors.releaseDate ? [{ message: formErrors.releaseDate }] : undefined} />
              </Field>

              <Field>
                <FieldLabel htmlFor="coverUrl">Cover image URL</FieldLabel>
                <Input
                  id="coverUrl"
                  name="coverUrl"
                  type="url"
                  placeholder="https://example.com/album-cover.jpg"
                  value={formData.coverUrl}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  aria-invalid={!!formErrors.coverUrl}
                  required
                />
                <FieldError errors={formErrors.coverUrl ? [{ message: formErrors.coverUrl }] : undefined} />
              </Field>

              {submitError && (
                <Field>
                  <FieldError>{submitError}</FieldError>
                </Field>
              )}

              <Field>
                <div className="flex gap-3">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create album'}
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

export default ArtistAlbumCreatePage
