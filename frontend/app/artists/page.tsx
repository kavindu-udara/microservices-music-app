"use client"
import apiClient from '@/axios/apiClient';
import CreateArtistDialog from '@/components/dialogs/CreateArtistDialog';
import { Button } from '@/components/ui/button';
import { ArtistType } from '@/types/index.types';
import React, { useEffect, useRef, useState } from 'react'

const ArtistPage = () => {

    const createDialogRef = useRef<HTMLButtonElement>(null);

    const [data, setData] = useState<ArtistType[] | null>(null);

    const fetchArtists = () => {
        apiClient.get("/music/artist/get-all").then(response => {
            console.log(response);
            setData(response.data.artists);
        }).catch(err => {
            console.error(err);
        })
    }

    useEffect(() => {
        fetchArtists();
    }, []);

    return (
        <>
            <div className='flex flex-col gap-5 p-5'>
                <div>
                    <Button onClick={() => createDialogRef.current?.click()}>Create artist</Button>
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
            <CreateArtistDialog triggerBtnRef={createDialogRef} successCallBack={fetchArtists} />
        </>
    )
}

export default ArtistPage
