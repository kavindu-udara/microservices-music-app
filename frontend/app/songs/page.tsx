"use client"
import apiClient from '@/axios/apiClient';
import CreateSongDialog from '@/components/dialogs/CreateSongDialog';
import { Button } from '@/components/ui/button';
import { ArtistType } from '@/types/index.types';
import React, { useEffect, useRef, useState } from 'react'

const SongsPage = () => {

  const createDialogTriggerRef = useRef<HTMLButtonElement>(null);

  const [artists, setArtists] = useState<ArtistType[] | null>(null);

  const fetchArtists = () => {
    apiClient.get("/music/artist/get-all").then(response => {
      console.log(response);
      setArtists(response.data.artists);
    }).catch(err => {
      console.error(err);
    })
  }

  const fetchSongs = () => {

  }

  useEffect(() => {
    fetchArtists();
    fetchSongs();
  }, []);

  return (
    <div>
      <Button onClick={() =>createDialogTriggerRef.current?.click()}>Create Song</Button>

      <CreateSongDialog triggerBtnRef={createDialogTriggerRef} successCallBack={fetchSongs} />
    </div>
  )
}

export default SongsPage
