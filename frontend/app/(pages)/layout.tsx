"use client"
import Header from '@/components/common/Header'
import { store } from '@/store'
import React from 'react'
import { Provider } from 'react-redux'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Provider store={store}>
        <Header/>
      {children}
    </Provider>
  )
}

export default layout
