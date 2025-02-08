import MainLayout from '@/app/Layouts/MainLayout'
import ChannelHeader from '@/components/Header/ChannelHeader'
import List from '@/components/Servers/List'
import { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
  title: 'Explore Servers',
  description: 'Servers page',
}

function page() {
  return (
    <MainLayout>
      <ChannelHeader selectedChannel="Servers" />
      <List />
    </MainLayout>
  )
}

export default page