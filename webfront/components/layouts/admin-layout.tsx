"use client";
import useAuthStore from '@/lib/store';
import { Account } from '@/types';
import { useRouter } from 'next/navigation';
import React, { ReactNode, useEffect } from 'react'

const UserLayout = ({ children }: { children: ReactNode }) => {

    const user : Account = useAuthStore((state) => state.user);

    const router = useRouter();

    useEffect(() => {
        if (!user || user.role !== "ADMIN" ) {
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
