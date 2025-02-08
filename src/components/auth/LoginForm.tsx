"use client"

import { useEffect, useState } from "react"
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, AuthError } from "@firebase/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { FaGoogle } from "react-icons/fa"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Head from "next/head"
import { auth } from "../../../lib/firebase"

export default function LoginPage() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [emailLoading, setEmailLoading] = useState<boolean>(false)
  const [googleLoading, setGoogleLoading] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        router.push("/app/me")
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailLoading(true)
    setError("")
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/app/me")
    } catch (error) {
      const err = error as AuthError
      switch (err.code) {
        case 'auth/invalid-credential':
          setError("Incorrect email or password")
          break
        case 'auth/too-many-requests':
          setError("Too many login attempts. Please try again later.")
          break
        default:
          setError(err.message || "Failed to log in. Please check your credentials.")
      }
    } finally {
      setEmailLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError("")
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      router.push("/app/me")
    } catch (error) {
      const err = error as AuthError
      setError(err.message || "Failed to log in with Google.")
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Login - LoopTalk</title>
      </Head>

      {/* Home Button */}
      <div className="absolute top-6 left-6 z-10">
        <Button
          onClick={() => router.push("/")}
          className="bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-700"
        >
          ← Return Home
        </Button>
      </div>
      
      <Card className="bg-gray-800 shadow-2xl border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-100">Welcome back!</CardTitle>
          <CardDescription className="text-gray-400">We're so excited to see you again!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase text-gray-300">EMAIL</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-900/50 border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase text-gray-300">PASSWORD</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-900/50 border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 text-white"
              disabled={emailLoading || googleLoading}
            >
              {emailLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </div>
              ) : (
                "Log In"
              )}
            </Button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 text-gray-400 bg-gray-800">or</span>
            </div>
          </div>
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full bg-gray-900/50 hover:bg-gray-700 text-gray-200 border-gray-700 flex items-center justify-center"
            disabled={emailLoading || googleLoading}
          >
            {googleLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in with Google...
              </div>
            ) : (
              <><FaGoogle className="mr-2" /> Continue with Google</>
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-400">
            Need an account?{" "}
            <Link href="/register" className="text-rose-400 hover:text-rose-300 hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </>
  )
}