"use client"

import { useEffect, useState } from "react"
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "@firebase/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { FaGoogle } from "react-icons/fa"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Head from "next/head"
import { auth, db } from "../../../lib/firebase"  
import { doc, setDoc } from "@firebase/firestore"

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [emailLoading, setEmailLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        router.push("/app/me")
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailLoading(true)
    setError("")
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update profile with username
      await updateProfile(userCredential.user, {
        displayName: username
      })

      // Save user details to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        username: username,
        email: email,
        photoURL: userCredential?.user?.photoURL,
        createdAt: new Date(),
      })

      router.push("/app/me")
    } catch (error: any) {
      switch(error.code) {
        case 'auth/email-already-in-use':
          setError("Email is already registered")
          break
        case 'auth/weak-password':
          setError("Password is too weak")
          break
        default:
          setError("Failed to create an account. Please try again.")
      }
    } finally {
      setEmailLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    setGoogleLoading(true)
    setError("")
    const provider = new GoogleAuthProvider()
    try {
      const userCredential = await signInWithPopup(auth, provider)
      
      if (username && !userCredential.user.displayName) {
        await updateProfile(userCredential.user, {
          displayName: username
        })
      }

      await setDoc(doc(db, "users", userCredential.user.uid), {
        username: userCredential.user.displayName || username,
        email: userCredential.user.email,
        photoURL: userCredential?.user?.photoURL,
        createdAt: new Date(),
      })

      router.push("/app/me")
    } catch (error: any) {
      setError("Failed to register with Google.")
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Register - LoopTalk</title>
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
          <CardTitle className="text-3xl font-bold text-gray-100">Create an account</CardTitle>
          <CardDescription className="text-gray-400">Join the LoopTalk community!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs font-bold uppercase text-gray-300">USERNAME</Label>
              <Input
                id="username"
                type="text"
                placeholder="Pick a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-900/50 border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
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
                placeholder="Create a password"
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
                  Creating account...
                </div>
              ) : (
                "Continue"
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
            onClick={handleGoogleRegister} 
            variant="outline" 
            className="w-full bg-gray-900/50 hover:bg-gray-700 text-gray-200 border-gray-700 flex items-center justify-center"
            disabled={emailLoading || googleLoading}
          >
            {googleLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing up with Google...
              </div>
            ) : (
              <><FaGoogle className="mr-2" /> Continue with Google</>
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-rose-400 hover:text-rose-300 hover:underline">
              Log In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </>
  )
}