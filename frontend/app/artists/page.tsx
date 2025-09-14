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

    const [data, setData] = useState<ArtistType | null>(null);

    useEffect(() => {
        apiClient.get("/music/artist").then(response => {
            console.log(response);
        }).catch(err => {
            console.error(err);
        })
    }, []);

    return (
        <div className='flex flex-col gap-5 p-5'>
            <div>
                <Button>Create artist</Button>
            </div>
            ArtistPage
        </div>
    )
}

export default ArtistPage
