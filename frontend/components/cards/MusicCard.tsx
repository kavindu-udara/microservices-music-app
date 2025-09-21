import { SongType } from "@/types/index.types";
import React from "react";
import { FaPlayCircle } from "react-icons/fa";

const MusicCard = ({ song }: { song: SongType }) => {
  return (
    <div className="border-2 border-black hover:shadow-2xl">
      <div className="h-50 overflow-y-hidden">
        <img
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/file/${song.image}`}
          alt=""
          className="w-full"
        />
      </div>
      <div className="px-5 py-3 flex flex-row items-center gap-3">
        <FaPlayCircle size={30}/>
        <div>{song.name}</div>
      </div>
    </div>
  );
};

export default MusicCard;
