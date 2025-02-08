import Me from '@/components/Home/Me'
import { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
  title: 'LoopTalk',
  description: 'Main page',
}


function page() {
  return (
    <div>
      <Me />
    </div>
  )
}

export default page