"use client"
import apiClient from '@/axios/apiClient';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react'

type ArtistType = {
    name: String,
    image: String,
    description: String,
    createdAt: String,
    updatedAt: String
}

const ArtistPage = () => {

    const [data, setData] = useState<ArtistType[] | null>(null);

    useEffect(() => {
        apiClient.get("/music/artist/get-all").then(response => {
            console.log(response);
            setData(response.data.artists);
        }).catch(err => {
            console.error(err);
        })
    }, []);

    return (
        <div className='flex flex-col gap-5 p-5'>
            <div>
                <Button>Create artist</Button>
            </div>
            {
                !data ? (
                    <div>
                        artists not available
                    </div>
                ) : (
                    <div>
                        {data.map((artist, index) => (
                            <div key={index}>
                                {artist.name}
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    )
}

export default ArtistPage
