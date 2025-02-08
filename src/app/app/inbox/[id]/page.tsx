import DMLayout from '@/app/Layouts/DMLayout'
import MainLayout from '@/app/Layouts/MainLayout'
import Inbox from '@/components/Chat/Inbox'
import InboxPage from '@/components/Chat/InboxPage'
import { UserProfilePage } from '@/components/UserProfilePage'
import { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
    title: 'Inbox',
    description: 'Inbox page',
}


function page() {
    return (
        <MainLayout>
            <DMLayout>
                <InboxPage />
            </DMLayout>
        </MainLayout>
    )
}

export default page