import AdminLeftSideNavBar from '@/components/admin/admin-eft-side-nav-bar'
import AdminHeader from '@/components/admin/admin-header'
import React, { ReactNode } from 'react'

const layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className='w-full min-h-screen flex flex-row text-white'>
            <AdminLeftSideNavBar />
            <div className='flex flex-col w-full'>
                <AdminHeader />
                {children}
            </div>
        </div>
    )
}

export default layout
