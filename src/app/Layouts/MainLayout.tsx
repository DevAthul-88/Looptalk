"use client"

import React from 'react';
import ServerLayout from './ServerLayout';
import { AuthProvider } from '../contexts/AuthContext';
import { Toaster } from 'sonner';

function MainLayout({ children }: any) {
    return (
        <ServerLayout>
            <Toaster />
            <AuthProvider>
                {/* Main Content */}
                <div className="flex-1 flex flex-col lg:ml-0 ">
                    {/* Fixed Header */}


                    {/* Content with top padding for fixed header */}
                    {children}
                </div>
            </AuthProvider>
        </ServerLayout>
    );
}

export default MainLayout;