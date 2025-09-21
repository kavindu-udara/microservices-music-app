import React, { RefObject, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArtistType } from "@/types/index.types";
import toast from "react-hot-toast";
import { tree } from "next/dist/build/templates/app-page";
import apiClient from "@/axios/apiClient";

type FormType = {
  name: string;
  artistId: string;
};

const CreateSongDialog = ({
  triggerBtnRef,
  artists,
  successCallBack,
}: {
  triggerBtnRef: RefObject<HTMLButtonElement | null>;
  artists: ArtistType[] | null;
  successCallBack: () => void;
}) => {
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const songFileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormType>({
    name: "",
    artistId: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleArtistChange = (value: string) => {
    setForm({ ...form, artistId: value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.artistId) {
      toast.error("All fields are required");
      return;
    }

    const coverImage = imageInputRef.current?.files?.[0];
    if (!coverImage) {
      toast.error("Cover image is required");
      return;
    }

    const songFile = songFileInputRef.current?.files?.[0];
    if (!songFile) {
      toast.error("Song file is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("image", coverImage);
    formData.append("songFile", songFile);
    formData.append("artistId", form.artistId);

    setIsLoading(true);

    apiClient
      .post("/music", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.success) {
          setIsLoading(false);
          toast.success("Song added success!");
          triggerBtnRef.current?.click();
          successCallBack();
          return;
        }
        toast.error(res.data.message);
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
        toast.error(err.data.message);
      });
  };

  return (
    <Dialog>
      <DialogTrigger ref={triggerBtnRef} className="hidden">
        Open
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new song</DialogTitle>
          <DialogDescription>Enter song details</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Label>Name</Label>
          <Input
            name="name"
            type="text"
            value={form.name}
            onChange={handleInputChange}
          />
          <Label>Image</Label>
          <Input
            name="image"
            type="file"
            accept="image/*"
            ref={imageInputRef}
          />
          <Label>Song</Label>
          <Input
            name="song"
            type="file"
            accept="audio/*"
            ref={songFileInputRef}
          />
          <Label>Artist</Label>
          <Select onValueChange={handleArtistChange} value={form.artistId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {artists?.map((artist) => (
                <SelectItem key={artist._id} value={artist._id}>
                  {artist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button disabled={isLoading} onClick={handleSubmit}>
            {isLoading ? "Loading..." : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSongDialog;
