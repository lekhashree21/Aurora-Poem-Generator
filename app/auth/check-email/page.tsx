import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="aurora-glow absolute inset-0 opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <Card className="bg-card/50 backdrop-blur border-border/50 p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Check your email</h1>
          <p className="text-muted-foreground mb-6">
            We've sent you a confirmation link. Please click it to verify your account.
          </p>
          <Link href="/auth/login" className="inline-block text-accent hover:underline text-sm">
            Back to login
          </Link>
        </Card>
      </div>
    </div>
  )
}
