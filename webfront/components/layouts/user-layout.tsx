"use client";
import useAuthStore from '@/lib/store';
import { useRouter } from 'next/navigation';
import React, { ReactNode, useEffect } from 'react'

const UserLayout = ({ children }: { children: ReactNode }) => {

    const user = useAuthStore((state) => state.user);

    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/login?errorMessage=Please login to access this page");
        }
    }, [user, router]);

    return (
        <>
            {children}
        </>
    )
}

export default UserLayout
