"use client"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/axios';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'

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

            <h1 className='text-4xl font-bold mb-5 flex gap-5'>
                {artist.name}
                <Badge variant={'outline'}>{artist.Country.code}</Badge>
            </h1>
            <p className='mb-3 text-gray-600'>{artist.bio}</p>

            <h2 className='text-xl font-semibold mb-3'>Albums</h2>
            <div className='flex flex-wrap gap-5'>
                {
                    artist.Album.length > 0 ? artist.Album.map((album) => (
                        <div key={album.id} className='w-50 border border-gray-700 rounded p-3'>
                            <Image
                                src={album.coverUrl}
                                alt={album.title}
                                width={200}
                                height={140}
                                className='w-full h-auto mb-3 rounded'
                            />
                            <h3 className='text-lg font-medium'>{album.title}</h3>
                            <p className='text-sm text-gray-400'>{new Date(album.releaseDate).toLocaleDateString()}</p>
                        </div>
                    )) : (
                        <p className='text-muted-foreground'>No albums found for this artist.</p>
                    )
                }
            </div>
        </div>
    )
}

export default SingleAdminArtistPage
