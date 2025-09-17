import { ArtistType } from '@/types/index.types'
import React from 'react'

const ArtistCard = ({ artist }: { artist: ArtistType }) => {
    return (
        <div className='flex flex-col items-center'>
            <img src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/file/${artist.image}`} alt="" className='w-20 h-20 rounded-2xl' />
            <div className='font-bold'>{artist.name}</div>
        </div>
    )
}

export default ArtistCard
