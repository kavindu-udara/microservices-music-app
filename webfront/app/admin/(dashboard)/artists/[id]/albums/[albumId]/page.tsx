"use client"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/axios';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { CloudOffIcon, Disc3Icon } from 'lucide-react';

type Track = {
  id: number;
  title: string;
  duration: number;
  audioUrl: string;
}

type Album = {
  id: number;
  title: string;
  artistId: number;
  releaseDate: string;
  coverUrl: string;
  track: Track[];
}

const formatDuration = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

const SingleAlbumPage = () => {
  const router = useRouter();
  const params = useParams();

  const artistId = Array.isArray(params.id) ? params.id[0] : params.id;
  const albumId = Array.isArray(params.albumId) ? params.albumId[0] : params.albumId;

  const [album, setAlbum] = React.useState<Album>({
    id: 0,
    title: "",
    artistId: 0,
    releaseDate: "",
    coverUrl: "",
    track: [],
  });
  const [isLoading, setIsLoading] = React.useState(Boolean(albumId));
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  useEffect(() => {
    if (!albumId) return;

    apiClient.get(`/catalog/album/${albumId}`).then((response) => {
      setAlbum(response.data.album);
    }).catch((error) => {
      console.error(error);
      setErrorMessage('Failed to fetch album details. Please try again.');
    }).finally(() => {
      setIsLoading(false);
    });
  }, [albumId]);

  if (!artistId || !albumId) {
    return (
      <div className='p-5'>
        <Button onClick={() => window.history.back()} variant={'link'}>
          &larr; Back
        </Button>
        <p className='text-red-500'>Album or artist id is missing.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className='p-5'>
        <Button onClick={() => router.push(`/admin/artists/${artistId}`)} variant={'link'}>
          &larr; Back to Artist
        </Button>

        <div className='animate-pulse space-y-4'>
          <div className='h-10 w-72 rounded bg-muted' />
          <div className='h-5 w-40 rounded bg-muted' />
          <div className='h-72 w-full max-w-sm rounded-2xl bg-muted' />

          <div className='pt-6 space-y-3'>
            <div className='h-7 w-24 rounded bg-muted' />
            {[1, 2, 3].map((item) => (
              <div key={item} className='h-16 w-full rounded-xl bg-muted' />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div className='p-5'>
        <Button onClick={() => router.push(`/admin/artists/${artistId}`)} variant={'link'}>
          &larr; Back to Artist
        </Button>
        <p className='text-red-500'>{errorMessage}</p>
      </div>
    )
  }

  return (
  <div className='p-5'>
    <Button onClick={() => router.push(`/admin/artists/${artistId}`)} variant={'link'}>
      &larr; Back to Artist
    </Button>

    <div className='mt-4 grid gap-8 lg:grid-cols-[320px_1fr] lg:items-start'>
      <div className='overflow-hidden rounded-3xl border border-border/60 bg-linear-to-br from-muted/60 via-background to-background p-3 shadow-sm'>
        {album.coverUrl ? (
          <Image
            src={album.coverUrl}
            alt={album.title}
            width={1200}
            height={1200}
            className='aspect-square w-full rounded-2xl object-cover'
          />
        ) : (
          <div className='flex aspect-square items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/40'>
            <div className='text-center text-muted-foreground'>
              <Disc3Icon className='mx-auto mb-3 size-10' />
              <p className='text-sm font-medium'>No album cover</p>
            </div>
          </div>
        )}
      </div>

      <div>
        <div className='flex items-center gap-3'>
          <h1 className='text-4xl font-bold'>{album.title}</h1>
          <Badge variant={'outline'}>
            {new Date(album.releaseDate).toLocaleDateString()}
          </Badge>
        </div>

        <div className='mt-10 flex items-center justify-between gap-4'>
          <h2 className='text-xl font-semibold'>Tracks</h2>
          <Button
            size={'sm'}
            onClick={() => router.push(`/admin/artists/${artistId}/albums/${albumId}/create`)}
          >
            Add Track
          </Button>
        </div>

        <div className='mt-4 flex flex-col gap-3'>
          {album.track.length > 0 ? album.track.map((track, index) => (
            <div key={track.id} className='rounded-2xl border border-border/70 bg-card p-4 shadow-sm'>
              <div className='mb-2 flex items-start justify-between gap-4'>
                <div>
                  <p className='text-sm text-muted-foreground'>Track {index + 1}</p>
                  <h3 className='text-lg font-medium'>{track.title}</h3>
                </div>
                <Badge variant={'outline'}>{formatDuration(track.duration)}</Badge>
              </div>

              {track.audioUrl ? (
                <audio controls className='w-full'>
                  <source src={track.audioUrl} />
                  Your browser does not support the audio element.
                </audio>
              ) : (
                <p className='text-sm text-muted-foreground'>No audio URL available</p>
              )}
            </div>
          )) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CloudOffIcon />
                </EmptyMedia>
                <EmptyTitle>No Tracks</EmptyTitle>
                <EmptyDescription>No tracks found for this album</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  onClick={() => router.push(`/admin/artists/${artistId}/albums/${albumId}/create`)}
                >
                  Add first track
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </div>
      </div>
    </div>
  </div>
  )
}

export default SingleAlbumPage
