import AdminLayout from '@/components/layouts/admin-layout'
import React, { ReactNode } from 'react'

const layout = ({children} : {children : ReactNode}) => {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  )
}

export default layout
