import React, { RefObject, useRef, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@radix-ui/react-label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import apiClient from '@/axios/apiClient';

type FormType = {
    name: string,
    description: string
}

const CreateArtistDialog = ({ triggerBtnRef }: { triggerBtnRef: RefObject<HTMLButtonElement | null> }) => {

    const artistImageInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState<FormType>({
        name: "",
        description: ""
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.name || !form.description) {
            toast.error("All fields are required");
            return;
        }

        const image = artistImageInputRef.current?.files?.[0];
        if (!image) {
            toast.error("Image is required")
            return;
        }

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("image", image);

        apiClient.post("/",
            formData
            , {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        ).then(res => {
            console.log(res);
        }).catch(err => {
            console.error(err);
        });

    }

    return (
        <Dialog>
            <DialogTrigger ref={triggerBtnRef} className='hidden'>Open</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create artist</DialogTitle>
                    <DialogDescription>
                        Enter artist details
                    </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-3'>
                    <Label>Name</Label>
                    <Input name='name' type='text' value={form.name} onChange={handleInputChange} />
                    <Label>Image</Label>
                    <Input name='image' type='file' accept='image/*' ref={artistImageInputRef} />
                    <Label>Description</Label>
                    <Textarea name='description' value={form.description} onChange={handleTextAreaChange} />
                    <Button onClick={handleSubmit}>Create</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateArtistDialog
