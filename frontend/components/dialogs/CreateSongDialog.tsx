import React, { RefObject, useRef, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const CreateSongDialog = ({ triggerBtnRef, successCallBack }: { triggerBtnRef: RefObject<HTMLButtonElement | null>, successCallBack: () => void }) => {

    const imageInputRef = useRef<HTMLInputElement>(null);
    const songFileInputRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [artist, setArtist] = useState<string>("");

    const handleSubmit = () => {

    }

    return (
        <Dialog>
            <DialogTrigger ref={triggerBtnRef} className='hidden'>Open</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create new song</DialogTitle>
                    <DialogDescription>
                        Enter song details
                    </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-3'>
                    <Label>Name</Label>
                    <Input name='name' type='text' value={name} onChange={(e) => setName(e.target.value)} />
                    <Label>Image</Label>
                    <Input name='image' type='file' accept='image/*' ref={imageInputRef} />
                    <Label>Song</Label>
                    <Input name='song' type='file' accept='audio/*' ref={songFileInputRef} />
                    <Label>Artist</Label>
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button disabled={isLoading} onClick={handleSubmit}>{isLoading ? "Loading..." : "Create"}</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateSongDialog
