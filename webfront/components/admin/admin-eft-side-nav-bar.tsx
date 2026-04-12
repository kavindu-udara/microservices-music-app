import { BadgeCentIcon, MusicIcon, UserRoundIcon } from 'lucide-react';
import React from 'react'
import { Button } from '../ui/button';


const navItems = [
  {
    name : 'Artists',
    icon : <UserRoundIcon />
  },
  {
    name: 'Tracks',
    icon: <MusicIcon />
  }
];

const AdminLeftSideNavBar = () => {
  return (
    <section className='bg-black w-50 flex flex-col gap-3 p-5 border-r border-gray-900'>
      <div className='pb-5'>
        <BadgeCentIcon />
      </div>
      {
        navItems.map((item) => (
          <Button variant={"ghost"} key={item.name} className='flex flex-wrap gap-3 justify-start w-full'>
            {item.icon} {item.name}
          </Button>
        ))
      }
    </section>
  )
}

export default AdminLeftSideNavBar
