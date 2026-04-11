"use client"
import Header from '@/components/common/header'
import LeftSideNav from '@/components/common/left-side-nav'
import React, { ReactNode } from 'react'

const layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className='w-full min-h-screen flex flex-row bg-black text-white'>
            <LeftSideNav />
            <div className='flex flex-col w-full'>
                <Header />
                {children}
            </div>
        </div>
    )
}

export default layout
