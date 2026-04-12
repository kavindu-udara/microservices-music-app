"use client"
import React, { useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
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

  useEffect(() => {
    apiClient.get('/catalog/artists').then((response) => {
      console.log(response.data);
      setArtists(response.data.artists);
    }).catch((error) => {
      console.error('Error fetching artists:', error);
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
          {
            artists.length > 0 && artists.map((artist) => (
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
            ))
          }
        </TableBody>
      </Table>
    </div>
  )
}

export default ArtistsPage
