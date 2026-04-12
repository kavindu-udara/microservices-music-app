"use client"
import { useParams } from 'next/navigation';
import React, { use, useEffect } from 'react'

const SingleAdminArtistPage = () => {

    const artistId = useParams().id;

    useEffect(() => {
        
    }, [artistId]);

  return (
    <div>
      
    </div>
  )
}

export default SingleAdminArtistPage
