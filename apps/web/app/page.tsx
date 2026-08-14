import { TrackList } from "@/components/track-list";
import UploadTrack from "@/components/upload-track";

export default function Home() {
  return (
   <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">AutoMix Web</h1>
      <UploadTrack />
      <TrackList />
    </main> 
  );
}
