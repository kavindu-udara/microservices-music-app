"use client"
import { Button } from '@/components/ui/button'
import apiClient from '@/lib/axios';
import axios from 'axios';
import React, { useRef } from 'react'

const TestPage = () => {

    const fileInputRef = useRef(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        // const file = formData.get('file') as File;
        const file = fileInputRef.current?.files[0];

        if (!file) {
            console.error("No file selected");
            return;
        }

        const data = new FormData();
        data.append('file', file);

        try {
            apiClient.post('/catalog/track/upload', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((response) => {
                console.log("Upload successful:", response.data);
            }).catch((error) => {
                console.error("Error uploading file:", error);
            });

        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <div className='w-full min-h-screen flex justify-center items-center'>
            <form onSubmit={handleSubmit}>
                <input type="file" ref={fileInputRef} />
                <Button>Upload file</Button>
            </form>
        </div>
    )
}

export default TestPage
