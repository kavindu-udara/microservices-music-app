"use client";
import apiClient from '@/lib/axios';
import { useRouter } from 'next/navigation';
import React, { ReactNode, useEffect } from 'react'

const UserLayout = ({ children }: { children: ReactNode }) => {

    const router = useRouter();

    useEffect(() => {
        apiClient.get("/auth/account").then((response) => {
            console.log("Account info:", response.data);
        }).catch((error) => {
            console.error("Failed to fetch account info:", error.response?.data || error.message);
            router.push("/login?errorMessage=Please log in to access your account");
        });
    }, [router]);

    return (
        <>
            {children}
        </>
    )
}

export default UserLayout
