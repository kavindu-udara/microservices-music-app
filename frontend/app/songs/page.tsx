"use client";
import apiClient from "@/axios/apiClient";
import MusicCard from "@/components/cards/MusicCard";
import CreateSongDialog from "@/components/dialogs/CreateSongDialog";
import BottomPlayer from "@/components/players/BottomPlayer";
import { Button } from "@/components/ui/button";
import { ArtistType, SongType } from "@/types/index.types";
import React, { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";

const SongsPage = () => {
  const createDialogTriggerRef = useRef<HTMLButtonElement>(null);

  const [artists, setArtists] = useState<ArtistType[] | null>(null);
  const [songs, setSongs] = useState<SongType[] | null>();

  const fetchArtists = () => {
    apiClient
      .get("/music/artist/get-all")
      .then((response) => {
        console.log(response);
        setArtists(response.data.artists);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchSongs = () => {
    apiClient
      .get("/music")
      .then((response) => {
        console.log(response);
        setSongs(response.data.songs);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchArtists();
    fetchSongs();
  }, []);

  return (
    <div>
      <Button onClick={() => createDialogTriggerRef.current?.click()}>
        Create Song
      </Button>

      <div className="w-full flex items-center justify-center">
        <div className="w-2xl border-black p-2 border-2 flex items-center gap-3">
          <input
            type="text"
            placeholder="Search"
            className="w-full active:border-none bg-transparent active:ring-0"
          />
          <FaSearch/>
        </div>
      </div>

      {songs ? (
        <div className="grid grid-cols-5 gap-5 p-5">
          {songs.map((song, index) => (
            <MusicCard key={index} song={song} />
          ))}
        </div>
      ) : (
        <div>songs not available</div>
      )}

      <CreateSongDialog
        artists={artists}
        triggerBtnRef={createDialogTriggerRef}
        successCallBack={fetchSongs}
      />

      <BottomPlayer/>
    </div>
  );
};

export default SongsPage;
