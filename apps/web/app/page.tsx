import UploadTrack from "@/components/upload-track";
import Image from "next/image";

export default function Home() {
  return (
   <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">AutoMix Web</h1>
      <UploadTrack />
    </main> 
  );
}
