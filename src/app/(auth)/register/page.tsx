import RegisterPage from '@/components/auth/Register'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Register - LoopTalk',
  description: 'Register page',
}

function page() {
  return (
    <div>
      <RegisterPage />
    </div>
  )
}

export default page