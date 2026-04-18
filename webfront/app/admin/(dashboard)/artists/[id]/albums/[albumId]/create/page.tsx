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

type Album = {
  id: number;
  title: string;
};

type TrackFormData = {
  title: string;
  duration: string;
  audioFile: File | null;
  language: string;
  genreIds: string;
  isExplicit: boolean;
  isPublished: boolean;
}

type FormErrors = Partial<Record<keyof TrackFormData, string>>;

const schema = z.object({
  title: z.string().trim().min(2, 'Track title must be at least 2 characters long'),
  duration: z.coerce.number().int().min(1, 'Duration must be at least 1 second'),
  language: z.string().trim().min(2, 'Language is required'),
  genreIds: z
    .string()
    .trim()
    .optional()
    .refine((value) => {
      if (!value) return true;
      return value
        .split(',')
        .map((part) => part.trim())
        .every((part) => /^\d+$/.test(part));
    }, 'Genre IDs must be comma-separated numbers'),
  isExplicit: z.boolean(),
  isPublished: z.boolean(),
});

type SchemaData = z.infer<typeof schema>;

const AddTrackPage = () => {
  const router = useRouter();
  const params = useParams();

  const artistId = useMemo(() => {
    const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
    return Number(rawId);
  }, [params.id]);

  const albumId = useMemo(() => {
    const rawId = Array.isArray(params.albumId) ? params.albumId[0] : params.albumId;
    return Number(rawId);
  }, [params.albumId]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [album, setAlbum] = useState<Album | null>(null);
  const [formData, setFormData] = useState<TrackFormData>({
    title: '',
    duration: '',
    audioFile: null,
    language: '',
    genreIds: '',
    isExplicit: false,
    isPublished: false,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!albumId || Number.isNaN(albumId)) return;

    apiClient
      .get(`/catalog/album/${albumId}`)
      .then((response) => {
        setAlbum(response.data.album);
      })
      .catch((error) => {
        console.error('Error fetching album details:', error);
        toast.error('Failed to load album details.');
      });
  }, [albumId]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!artistId || Number.isNaN(artistId) || !albumId || Number.isNaN(albumId)) {
      const message = 'Invalid artist or album id.';
      toast.error(message);
      setSubmitError(message);
      return;
    }

    const result = schema.safeParse({
      title: formData.title,
      duration: formData.duration,
      language: formData.language,
      genreIds: formData.genreIds,
      isExplicit: formData.isExplicit,
      isPublished: formData.isPublished,
    });
    if (!result.success) {
      const nextErrors: FormErrors = {};
      const flattened = result.error.flatten().fieldErrors;

      for (const key of Object.keys(flattened) as Array<keyof SchemaData>) {
        const first = flattened[key]?.[0];
        if (first) nextErrors[key] = first;
      }

      setFormErrors(nextErrors);
      return;
    }

    if (!formData.audioFile) {
      setFormErrors((prev) => ({ ...prev, audioFile: 'MP3 file is required' }));
      return;
    }

    const allowedMimeTypes = ['audio/mpeg', 'audio/mp3', 'audio/x-mpeg-3'];
    if (!allowedMimeTypes.includes(formData.audioFile.type)) {
      setFormErrors((prev) => ({ ...prev, audioFile: 'Only MP3 files are allowed' }));
      return;
    }

    const genreIds = result.data.genreIds
      ? result.data.genreIds
          .split(',')
          .map((part) => Number(part.trim()))
          .filter((value) => Number.isInteger(value) && value > 0)
      : [];

    setFormErrors({});

    try {
      setIsSubmitting(true);
      setUploadProgress(0);

      const payload = new FormData();
      payload.append('file', formData.audioFile);
      payload.append('title', result.data.title);
      payload.append('albumId', String(albumId));
      payload.append('duration', String(result.data.duration));
      payload.append('language', result.data.language);
      payload.append('isExplicit', String(result.data.isExplicit));
      payload.append('isPublished', String(result.data.isPublished));
      payload.append('artistIds', String(artistId));
      if (genreIds.length > 0) {
        payload.append('genreIds', genreIds.join(','));
      }

      await apiClient.post('/catalog/track', payload, {
        onUploadProgress: (event) => {
          const totalBytes = event.total ?? formData.audioFile?.size;
          if (!totalBytes) return;

          const progress = Math.round((event.loaded * 100) / totalBytes);
          setUploadProgress(Math.min(100, Math.max(0, progress)));
        },
      });

      toast.success('Track created successfully.');
      router.push(`/admin/artists/${artistId}/albums/${albumId}`);
    } catch (error) {
      console.error('Error creating track:', error);

      const backendMessage = axios.isAxiosError(error)
        ? error.response?.data?.error
        : null;

      const friendlyMessage = backendMessage || 'Failed to create track. Please try again.';

      toast.error(friendlyMessage);
      setSubmitError(friendlyMessage);
    } finally {
      setUploadProgress(0);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center p-5">
      <div className="w-2xl">
        <form onSubmit={handleSubmit}>
          <FieldSet>
            <FieldLegend>Add track</FieldLegend>
            <FieldDescription>
              Create a track for {album?.title || 'selected album'}
            </FieldDescription>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Track title</FieldLabel>
                <Input
                  id="title"
                  name="title"
                  autoComplete="off"
                  placeholder="Moonlight Intro"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  aria-invalid={!!formErrors.title}
                  required
                />
                <FieldError errors={formErrors.title ? [{ message: formErrors.title }] : undefined} />
              </Field>

              <Field>
                <FieldLabel htmlFor="duration">Duration (seconds)</FieldLabel>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min={1}
                  placeholder="240"
                  value={formData.duration}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  aria-invalid={!!formErrors.duration}
                  required
                />
                <FieldError errors={formErrors.duration ? [{ message: formErrors.duration }] : undefined} />
              </Field>

              <Field>
                <FieldLabel htmlFor="audioFile">Audio file (MP3)</FieldLabel>
                <Input
                  id="audioFile"
                  name="audioFile"
                  type="file"
                  accept="audio/mpeg,audio/mp3,.mp3"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    setFormData((prev) => ({ ...prev, audioFile: file }));
                    setFormErrors((prev) => ({ ...prev, audioFile: undefined }));
                  }}
                  disabled={isSubmitting}
                  aria-invalid={!!formErrors.audioFile}
                  required
                />
                <FieldDescription>
                  {formData.audioFile ? `Selected: ${formData.audioFile.name}` : 'Upload an mp3 track file.'}
                </FieldDescription>
                {isSubmitting && (
                  <div className="space-y-2">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <FieldDescription>Uploading: {uploadProgress}%</FieldDescription>
                  </div>
                )}
                <FieldError errors={formErrors.audioFile ? [{ message: formErrors.audioFile }] : undefined} />
              </Field>

              <Field>
                <FieldLabel htmlFor="language">Language</FieldLabel>
                <Input
                  id="language"
                  name="language"
                  placeholder="English"
                  value={formData.language}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  aria-invalid={!!formErrors.language}
                  required
                />
                <FieldError errors={formErrors.language ? [{ message: formErrors.language }] : undefined} />
              </Field>

              <Field>
                <FieldLabel htmlFor="genreIds">Genre IDs (optional)</FieldLabel>
                <Input
                  id="genreIds"
                  name="genreIds"
                  placeholder="1,2,4"
                  value={formData.genreIds}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  aria-invalid={!!formErrors.genreIds}
                />
                <FieldDescription>Use comma-separated genre ids.</FieldDescription>
                <FieldError errors={formErrors.genreIds ? [{ message: formErrors.genreIds }] : undefined} />
              </Field>

              <Field>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="isExplicit"
                    checked={formData.isExplicit}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  Explicit content
                </label>
              </Field>

              <Field>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  Publish immediately
                </label>
              </Field>

              {submitError && (
                <Field>
                  <FieldError>{submitError}</FieldError>
                </Field>
              )}

              <Field>
                <div className="flex gap-3">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? uploadProgress > 0
                        ? `Uploading ${uploadProgress}%`
                        : 'Uploading...'
                      : 'Create track'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={() => router.push(`/admin/artists/${artistId}/albums/${albumId}`)}
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

export default AddTrackPage
