"use client"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/axios';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { CloudOffIcon, Music2Icon } from 'lucide-react';

type Artist = {
    id: number,
    name: string,
    bio: string,
    imageUrl: string,
    Country: {
        name: string,
        code: string
    },
    Album: {
        id: number,
        title: string,
        coverUrl: string,
        releaseDate: string
    }[]
}

const SingleAdminArtistPage = () => {

    const artistId = useParams().id;
    const normalizedArtistId = Array.isArray(artistId) ? artistId[0] : artistId;

    const [artist, setArtist] = React.useState<Artist>({
        id: 0,
        name: '',
        bio: '',
        imageUrl: '',
        Country: {
            name: '',
            code: ''
        },
        Album: []
    });
    const [isLoading, setIsLoading] = React.useState(Boolean(normalizedArtistId));
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    useEffect(() => {
        if (!normalizedArtistId) {
            return;
        }

        apiClient.get(`/catalog/artist/${normalizedArtistId}`).then((response) => {
            setArtist(response.data.artist);
        }).catch((error) => {
            console.error(error);
            setErrorMessage('Failed to fetch artist details. Please try again.');
        }).finally(() => {
            setIsLoading(false);
        })
    }, [normalizedArtistId]);

    if (!normalizedArtistId) {
        return (
            <div className='p-5'>
                <Button onClick={() => window.history.back()} variant={'link'}>
                    &larr; Back to Artists
                </Button>
                <p className='text-red-500'>Artist id is missing.</p>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className='p-5'>
                <Button onClick={() => window.history.back()} variant={'link'}>
                    &larr; Back to Artists
                </Button>

                <div className='animate-pulse space-y-4'>
                    <div className='h-10 w-72 rounded bg-muted' />
                    <div className='h-5 w-full max-w-xl rounded bg-muted' />
                    <div className='h-5 w-full max-w-lg rounded bg-muted' />

                    <div className='pt-4'>
                        <div className='h-7 w-24 rounded bg-muted mb-4' />
                        <div className='flex flex-wrap gap-5'>
                            {[1, 2, 3].map((item) => (
                                <div key={item} className='w-50 rounded border p-3 space-y-3'>
                                    <div className='h-28 w-full rounded bg-muted' />
                                    <div className='h-5 w-3/4 rounded bg-muted' />
                                    <div className='h-4 w-1/2 rounded bg-muted' />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (errorMessage) {
        return (
            <div className='p-5'>
                <Button onClick={() => window.history.back()} variant={'link'}>
                    &larr; Back to Artists
                </Button>
                <p className='text-red-500'>{errorMessage}</p>
            </div>
        )
    }

    return (
        <div className='p-5'>

            {/* go back navigator */}
            <Button onClick={() => window.history.back()} variant={'link'}>
                &larr; Back to Artists
            </Button>

            <div className='mt-4 grid gap-8 lg:grid-cols-[320px_1fr] lg:items-start'>
                <div className='overflow-hidden rounded-3xl border border-border/60 bg-linear-to-br from-muted/60 via-background to-background p-3 shadow-sm'>
                    {artist.imageUrl ? (
                        <div className='relative aspect-square overflow-hidden rounded-2xl bg-muted'>
                            <img
                                src={artist.imageUrl}
                                alt={artist.name}
                                fill
                                sizes='(max-width: 1024px) 100vw, 320px'
                                className='object-cover'
                                priority
                            />
                        </div>
                    ) : (
                        <div className='flex aspect-square items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/40'>
                            <div className='text-center text-muted-foreground'>
                                <Music2Icon className='mx-auto mb-3 size-10' />
                                <p className='text-sm font-medium'>No artist image</p>
                            </div>
                        </div>
                    )}
                    <div className='mt-4 flex items-center justify-between gap-3 px-1'>
                        <div>
                            <p className='text-sm text-muted-foreground'>Country</p>
                            <div className='mt-1 flex items-center gap-2'>
                                <Badge variant={'outline'}>{artist.Country.code}</Badge>
                                <span className='text-sm font-medium'>{artist.Country.name}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className='flex flex-wrap items-center gap-3'>
                        <h1 className='text-4xl font-bold'>{artist.name}</h1>
                        <Badge variant={'outline'}>{artist.Country.code}</Badge>
                    </div>
                    <p className='mt-4 max-w-3xl text-muted-foreground leading-7'>{artist.bio}</p>

                    <div className='mt-10 flex items-center justify-between gap-4'>
                        <h2 className='text-xl font-semibold'>Albums</h2>
                        {artist.Album.length > 0 && (
                            <Button size={'sm'}>Add New Album</Button>
                        )}
                    </div>

                    <div className='mt-4 flex flex-wrap gap-5'>
                        {
                            artist.Album.length > 0 ? artist.Album.map((album) => (
                                <div key={album.id} className='w-50 overflow-hidden rounded-2xl border border-border/70 bg-card p-3 shadow-sm transition-transform hover:-translate-y-0.5'>
                                    <Image
                                        src={album.coverUrl}
                                        alt={album.title}
                                        width={200}
                                        height={140}
                                        className='mb-3 h-40 w-full rounded-xl object-cover'
                                    />
                                    <h3 className='text-lg font-medium'>{album.title}</h3>
                                    <p className='text-sm text-muted-foreground'>{new Date(album.releaseDate).toLocaleDateString()}</p>
                                </div>
                            )) : (

                                <Empty>
                                    <EmptyHeader>
                                        <EmptyMedia variant="icon">
                                            <CloudOffIcon />
                                        </EmptyMedia>
                                        <EmptyTitle>No Albums</EmptyTitle>
                                        <EmptyDescription>No albums found</EmptyDescription>
                                    </EmptyHeader>
                                    <EmptyContent>
                                        <Button>Add new album</Button>
                                    </EmptyContent>
                                </Empty>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleAdminArtistPage
