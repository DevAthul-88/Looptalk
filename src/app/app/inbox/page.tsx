import { AuthProvider } from '@/app/contexts/AuthContext'
import DMLayout from '@/app/Layouts/DMLayout'
import MainLayout from '@/app/Layouts/MainLayout'
import ChatHistory from '@/components/Chat/HistoryPage'
import ChannelHeader from '@/components/Header/ChannelHeader'
import { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
    title: 'Conversations',
    description: 'Conversations page',
}


function page() {
    return (
        <MainLayout>
            <AuthProvider>
            <ChannelHeader selectedChannel="Conversations" />
                <DMLayout>
                    <ChatHistory />
                </DMLayout>
            </AuthProvider>
        </MainLayout>
    )
}

export default page