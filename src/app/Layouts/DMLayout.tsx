"use client";

import React from 'react';
import { useRouter, useParams } from 'next/navigation';

function DMLayout({ children }) {
    const router = useRouter();
    const params = useParams();
    return (
        <div className="h-screen flex flex-col">
            {children}
        </div>
    );
}

export default DMLayout;