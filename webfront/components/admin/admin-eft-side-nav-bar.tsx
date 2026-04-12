"use client";
import { BadgeCentIcon, ChartNoAxesColumnIcon, MusicIcon, UserRoundIcon } from 'lucide-react';
import React, { use } from 'react'
import { Button } from '../ui/button';
import path from 'path';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


const navItems = [
  {
    name: 'Dashboard',
    icon: <ChartNoAxesColumnIcon />,
    path: '/admin'
  },
  {
    name: 'Artists',
    icon: <UserRoundIcon />,
    path: '/admin/artists'
  },
  {
    name: 'Tracks',
    icon: <MusicIcon />,
    path: '/admin/tracks'
  }
];

const AdminLeftSideNavBar = () => {

  const currentPath = usePathname();

  return (
    <section className='bg-black w-50 flex flex-col gap-3 p-5 border-r border-gray-900'>
      <div className='pb-5'>
        <BadgeCentIcon />
      </div>
      {
        navItems.map((item) => (
          <Link key={item.name} href={item.path}>
            <Button variant={"ghost"} key={item.name} className={`flex flex-wrap gap-3 justify-start w-full`}>
              {item.icon} {item.name}
            </Button>
          </Link>
        ))
      }
    </section>
  )
}

export default AdminLeftSideNavBar
