import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-5 p-10">
      <div className="flex flex-col gap-5">
        {/* row */}
        <div className="flex justify-between items-center">
          <div className="font-bold text-lg">New Albums</div>
          <div className="text-sm flex items-center gap-2">
            <span className="p bg-gray-900 rounded-full">
              <ChevronLeftIcon />
            </span>
            <span className="p bg-gray-900 rounded-full">
              <ChevronRightIcon />
            </span>
            <span className="text-gray-500">View all</span>
          </div>
        </div>
        <AlbumCard />

        {/* artist */}
        <div className="flex justify-between items-center">
          <div className="font-bold text-lg">Popular artists</div>
          <div className="text-sm flex items-center gap-2">
            <span className="p bg-gray-900 rounded-full">
              <ChevronLeftIcon />
            </span>
            <span className="p bg-gray-900 rounded-full">
              <ChevronRightIcon />
            </span>
            <span className="text-gray-500">View all</span>
          </div>
        </div>
        <div className="flex flex-wrap">
        <ArtistCard />
        </div>
      </div>
    </div>
  );
}

const AlbumCard = () => {
  return (
    <div className="flex flex-col gap-2 text-sm cursor-pointer">
      <Image width={200} height={200} src="/images/10-til-midnight.jpg" alt="album" />
      <div className="font-semibold">10 Til Midnight</div>
      <div className="text-gray-500">Snoop Dogg</div>
    </div>
  )
}

const ArtistCard = () => {
  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer">
      <Image width={180} height={180} src="/images/future.jpg" alt="artist" className="rounded-full" />
      <div className="font-semibold text-sm">Future</div>
    </div>
  )
}
