"use client";
import useAuthStore, { AuthState } from '@/lib/store';
import { useRouter } from 'next/navigation';
import React, { ReactNode, useEffect } from 'react'

const AdminLayout = ({ children }: { children: ReactNode }) => {

    const { user, isHydrated, setHydrated } = useAuthStore() as AuthState;

    const router = useRouter();

    useEffect(() => {
        setHydrated(true);
    }, [setHydrated]);

    useEffect(() => {
        if (!isHydrated) return;
        if (!user || user.role !== "ADMIN" ) {
            console.log({user});
            router.push("/login?errorMessage=Please login to access this page");
        }
    }, [user, router, isHydrated]);

    return (
        <>
            {children}
        </>
    )
}

export default AdminLayout
