import LoginPage from '@/components/auth/LoginForm'
import { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
  title: 'Login - LoopTalk',
  description: 'Login page',
}


function page() {
  return (
    <div>
      <LoginPage />
    </div>
  )
}

export default page