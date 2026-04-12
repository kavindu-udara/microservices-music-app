"use client"
import React, { useEffect } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import apiClient from '@/lib/axios';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Country = {
    name: string,
    code: string
}

type Artist = {
    id: number,
    name: string,
    bio: string,
    imageUrl: string,
    Country: Country
}

const tableHeadings = [
    {
        name: 'Icon',
        className: 'w-[100px]'
    },
    {
        name: 'Name',
        className: ''
    },
    {
        name: 'Bio',
        className: ''
    },
    {
        name: 'Country',
        className: ''
    },
    {
        name: 'Options',
        className: 'text-right'
    }
];

const ArtistsPage = () => {

    const [artists, setArtists] = React.useState<Artist[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    useEffect(() => {
        apiClient.get('/catalog/artists').then((response) => {
            setArtists(response.data.artists ?? []);
            setIsSuccess(true);
        }).catch((error) => {
            console.error('Error fetching artists:', error);
            setErrorMessage('Failed to fetch artists. Please try again.');
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    return (
        <div className='p-5 flex flex-col gap-5'>
            <div className='flex justify-end'>
                <Button> <PlusIcon /> Add New Artist</Button>
            </div>
            {/* table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        {
                            tableHeadings.map((heading) => (
                                <TableHead key={heading.name} className={heading.className}>{heading.name}</TableHead>
                            ))
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && (
                        <TableRow>
                            <TableCell colSpan={5} className='text-center text-muted-foreground'>
                                Loading artists...
                            </TableCell>
                        </TableRow>
                    )}

                    {!isLoading && errorMessage && (
                        <TableRow>
                            <TableCell colSpan={5} className='text-center text-red-500'>
                                {errorMessage}
                            </TableCell>
                        </TableRow>
                    )}

                    {!isLoading && !errorMessage && isSuccess && artists.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className='text-center text-muted-foreground'>
                                Data fetched successfully, but no artists were found.
                            </TableCell>
                        </TableRow>
                    )}

                    {!isLoading && !errorMessage && isSuccess && artists.length > 0 && artists.map((artist) => (
                            <TableRow key={artist.id}>
                                <TableCell className="font-medium">
                                    <Avatar>
                                        <AvatarImage src={artist.imageUrl} />
                                        <AvatarFallback>
                                            {artist.name.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell>{artist.name}</TableCell>
                                <TableCell>{artist.bio}</TableCell>

                                <TableCell>{artist.Country.code}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant={"outline"} size={"sm"}>Edit</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default ArtistsPage
