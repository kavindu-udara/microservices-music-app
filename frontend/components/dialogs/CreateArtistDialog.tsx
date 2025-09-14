import React, { RefObject } from 'react';
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

const CreateArtistDialog = ({triggerBtnRef} : {triggerBtnRef : RefObject<HTMLButtonElement | null>}) => {
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
                    <Input/>
                    <Label>Image</Label>
                    <Input/>
                    <Label>Description</Label>
                    <Textarea/>
                    <Button>Create</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateArtistDialog
