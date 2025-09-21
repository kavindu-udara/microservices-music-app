import React from "react";
import { FaPlayCircle } from "react-icons/fa";
import { Slider } from "@/components/ui/slider";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";

const BottomPlayer = () => {
  return (
    <div className="border-t-2 border-black absolute bottom-0 left-0 right-0 z-10 px-3 flex items-center justify-around gap-4">
      <div className="flex gap-3">
        <MdSkipPrevious size={40} className="cursor-pointer" />
        <FaPlayCircle size={40} className="cursor-pointer" />
        <MdSkipNext size={40} className="cursor-pointer" />
      </div>
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 overflow-hidden flex items-center">
          <img
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/file/6470b524-a360-4d7b-b9b6-0fe254c257a0.jpg`}
            alt=""
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-3 w-full">
          <div className="text-lg font-semibold">Before We Say Goodbye</div>
          <div>Dune</div>
        </div>
      </div>
      <div className="flex gap-3">
        <span>1:02</span>
        <Slider defaultValue={[33]} max={100} step={1} className="w-2xl" />
        <span>1:02</span>
      </div>
    </div>
  );
};

export default BottomPlayer;
