"use client"
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import apiClient from '@/lib/axios';
import React, { useEffect, useState } from 'react'

type Genre = {
    id: number,
    name: string,
    slug: string,
    description: string
}

const tableHeadings = [
  {
    name: 'Name',
    className: ''
  },
  {
    name: 'Slug',
    className: ''
  },
  {
    name: 'Description',
    className: ''
  },
  {
    name: 'Options',
    className: 'text-right'
  }
];

const GenresPage = () => {

  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    apiClient.get("/catalog/genres").then(response => {
      setGenres(response.data.genres ?? []);
      console.log("Fetched genres:", response.data);
    }).catch(error => {
      console.error("Error fetching genres:", error);
    }).finally(() => {      
      setIsLoading(false);
    });
  }, []);

  return (
    <div className='p-5 flex flex-col gap-5'>
      <div className="flex justify-end">
        <Button>Add New Genre</Button>
      </div>

{/* table */}
    <Table>
      <TableHeader>
        <TableRow>
{
  tableHeadings.map((heading, index) => (
    <TableHead key={index} className={heading.className}>{heading.name}</TableHead>
  ))
}
        </TableRow>
      </TableHeader>
  <TableBody>
    {isLoading && (
      Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={`genre-loading-${index}`}>
          <TableCell>
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </TableCell>
          <TableCell>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
          </TableCell>
          <TableCell>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
          </TableCell>
          <TableCell className="text-right">
            <div className="h-8 bg-muted rounded w-20 inline-block"></div>
          </TableCell>
        </TableRow>
      ))
    )}
    {!isLoading && genres.length === 0 && (
      <TableRow>
        <TableCell colSpan={4} className="text-center py-4">
          No genres found.
        </TableCell>
      </TableRow>
    )}
    {!isLoading && genres.map((genre: Genre) => (
      <TableRow key={genre.id}>
        <TableCell>{genre.name}</TableCell>
        <TableCell>{genre.slug}</TableCell>
        <TableCell>{genre.description}</TableCell>
        <TableCell className="text-right">
          <Button variant="outline" size="sm">Edit</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
    </Table>

    </div>
  )
}

export default GenresPage
