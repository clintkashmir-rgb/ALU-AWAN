
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

  // Security Key Provided by User
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
        toast({ title: "Account Created", description: "Welcome to Awan Industrial Manager." })
      } else {
        initiateEmailSignIn(auth, email, password)
        toast({ title: "Authorized Access", description: "Successfully logged into system." })
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Authentication Failed", description: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGuestLogin = () => {
    setIsSubmitting(true)
    try {
      initiateAnonymousSignIn(auth)
      toast({ title: "Guest Session Active", description: "Limited staff access granted." })
    } catch (error: any) {
      toast({ variant: "destructive", title: "Session Error", description: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isUserLoading) return <div className="min-h-screen flex items-center justify-center font-black animate-pulse text-accent text-2xl tracking-tighter uppercase">Initializing Awan Management System...</div>

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background selection:bg-accent/30">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-20 w-20 bg-accent text-accent-foreground rounded-[2rem] flex items-center justify-center shadow-2xl mb-4 border-4 border-accent/20">
            <Package className="h-12 w-12" />
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">AWAN ALUMINUM</h1>
          <p className="text-muted-foreground font-black text-[10px] tracking-[0.3em] uppercase">Industrial Precision Management</p>
        </div>

        <Card className="border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] bg-card overflow-hidden">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-xl font-black uppercase flex items-center gap-2 tracking-tight">
              {isSignUp ? <UserPlus className="h-5 w-5 text-accent" /> : <LogIn className="h-5 w-5 text-accent" />}
              {isSignUp ? "Register Controller" : "System Authorization"}
            </CardTitle>
            <CardDescription className="font-bold text-[10px] uppercase">Secure biometric-ready industrial login</CardDescription>
          </CardHeader>
          <form onSubmit={handleEmailAuth}>
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Officer Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="email" 
                    placeholder="name@awan-aluminum.com" 
                    className="pl-10 h-14 font-bold border-2 focus:border-accent" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Access Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 h-14 font-bold border-2 focus:border-accent" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              
              <div className="pt-2 flex items-center justify-center gap-2 text-[9px] text-muted-foreground font-black uppercase bg-muted/50 py-2 rounded-lg border border-dashed">
                <ShieldCheck className="h-3 w-3 text-accent" />
                <span>Security Token: {SECURITY_SITE_KEY.slice(0, 15)}...</span>
                <input type="hidden" name="security-key" value={SECURITY_SITE_KEY} />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pb-8">
              <Button 
                type="submit" 
                className="w-full h-14 bg-accent text-accent-foreground font-black uppercase tracking-[0.2em] hover:bg-accent/90 shadow-xl transition-all transform active:scale-[0.98] rounded-xl" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "AUTHORIZING..." : isSignUp ? "INITIALIZE ACCOUNT" : "SECURE LOGIN"}
              </Button>
              <div className="grid grid-cols-2 gap-4 w-full">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="gap-2 h-12 text-[10px] font-black uppercase border-2" 
                  onClick={handleGuestLogin} 
                  disabled={isSubmitting}
                >
                  <UserCircle className="h-4 w-4" /> GUEST ACCESS
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="text-[10px] font-black uppercase" 
                  onClick={() => setIsSignUp(!isSignUp)}
                >
                  {isSignUp ? "SYSTEM LOGIN" : "CREATE ACCOUNT"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
