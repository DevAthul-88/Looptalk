import { AuthProvider } from '@/app/contexts/AuthContext'
import { UserProfilePage } from '@/components/UserProfilePage'
import { Metadata } from 'next'
import React from 'react'
import { Toaster } from 'sonner'


export const metadata: Metadata = {
    title: 'Profile ',
    description: 'Main page',
}


function page() {
    return (
        <div>
            <AuthProvider>
                <Toaster />
                <UserProfilePage />
            </AuthProvider>
        </div>
    )
}

export default page