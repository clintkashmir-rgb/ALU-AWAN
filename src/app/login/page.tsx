
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package, Lock, Mail, UserPlus, LogIn, UserCircle, ShieldCheck } from "lucide-react"
import { useAuth, initiateEmailSignIn, initiateEmailSignUp, initiateAnonymousSignIn, useUser } from "@/firebase"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const { user, isUserLoading } = useUser()
  const auth = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [isSignUp, setIsSignUp] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Security Key Registration
  const SECURITY_SITE_KEY = "6Lf_KHwsAAAAAO6RzfIkQrIjuuDBtuvEmjlKJloM";

  React.useEffect(() => {
    if (user && !isUserLoading) {
      router.push("/")
    }
  }, [user, isUserLoading, router])

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    
    setIsSubmitting(true)
    try {
      if (isSignUp) {
        initiateEmailSignUp(auth, email, password)
        toast({ title: "Account Created", description: "Welcome to Awan Manager." })
      } else {
        initiateEmailSignIn(auth, email, password)
        toast({ title: "Welcome Back", description: "Synchronizing your profile..." })
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Auth Error", description: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGuestLogin = () => {
    setIsSubmitting(true)
    try {
      initiateAnonymousSignIn(auth)
      toast({ title: "Guest Access", description: "Logged in anonymously." })
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isUserLoading) {
    return <div className="min-h-screen flex items-center justify-center font-black animate-pulse">AWAN MANAGER...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-16 w-16 bg-accent text-accent-foreground rounded-2xl flex items-center justify-center shadow-2xl mb-4">
            <Package className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Awan Aluminum</h1>
          <p className="text-muted-foreground font-bold text-xs tracking-[0.2em] uppercase">Industrial Precision Manager</p>
        </div>

        <Card className="border-none shadow-2xl bg-card">
          <CardHeader>
            <CardTitle className="text-xl font-black uppercase flex items-center gap-2">
              {isSignUp ? <UserPlus className="h-5 w-5 text-accent" /> : <LogIn className="h-5 w-5 text-accent" />}
              {isSignUp ? "Create Account" : "Staff Login"}
            </CardTitle>
            <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
          </CardHeader>
          <form onSubmit={handleEmailAuth}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="email" 
                    placeholder="name@awan.com" 
                    className="pl-10 h-12" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 h-12" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-bold uppercase">
                <ShieldCheck className="h-3 w-3 text-accent" />
                <span>Security Protected</span>
                <input type="hidden" name="security-key" value={SECURITY_SITE_KEY} />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full h-12 bg-accent text-accent-foreground font-black uppercase tracking-widest hover:bg-accent/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : isSignUp ? "Sign Up" : "Login Now"}
              </Button>
              
              <div className="relative w-full flex items-center justify-center">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <span className="relative bg-card px-2 text-[10px] uppercase font-bold text-muted-foreground">Or access via</span>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="gap-2 h-11 text-xs font-bold" 
                  onClick={handleGuestLogin}
                  disabled={isSubmitting}
                >
                  <UserCircle className="h-4 w-4" /> GUEST
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="text-xs font-bold"
                  onClick={() => setIsSignUp(!isSignUp)}
                >
                  {isSignUp ? "ALREADY USER?" : "REGISTER"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
        
        <p className="text-center text-[9px] text-muted-foreground font-medium italic">
          Authorized personnel only. All access is logged by Awan Industrial Fabrication.
        </p>
      </div>
    </div>
  )
}
