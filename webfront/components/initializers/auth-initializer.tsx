"use client";
import apiClient from '@/lib/axios';
import useAuthStore from '@/lib/store';
import React, { use, useEffect } from 'react'

const AuthInitializer = () => {
    useEffect(() => {
        apiClient.get("/auth/account").then((response) => {
            console.log("Fetched account info:", response.data);
            useAuthStore.setState({ user: response.data.account });
        }).catch((error) => {
            useAuthStore.setState({ user: null });
            console.error("Failed to fetch account info:", error.response?.data || error.message);
        });
    });

    return null;
}

export default AuthInitializer
