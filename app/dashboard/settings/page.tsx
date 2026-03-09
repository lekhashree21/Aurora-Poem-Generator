import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Information */}
        <Card className="bg-card/50 border-border/50 p-6">
          <h2 className="text-lg font-semibold mb-6">Account Information</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground">Email</Label>
              <p className="mt-2 text-foreground">{user.email}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Display Name</Label>
              <p className="mt-2 text-foreground">{profile?.display_name || "Not set"}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Member Since</Label>
              <p className="mt-2 text-foreground">{new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </Card>

        {/* API Key */}
        <Card className="bg-card/50 border-border/50 p-6">
          <h2 className="text-lg font-semibold mb-6">API Access</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="api-key" className="text-sm text-muted-foreground">
                Your API Key
              </Label>
              <Input id="api-key" type="password" readOnly value={user.id} className="mt-2 text-xs font-mono" />
              <p className="text-xs text-muted-foreground mt-2">
                Use your access token from Supabase Auth for API requests
              </p>
            </div>
            <Button variant="outline" className="border-border/50 bg-transparent w-full">
              Copy API Key
            </Button>
          </div>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="bg-destructive/10 border-destructive/30 p-6">
        <h2 className="text-lg font-semibold mb-4 text-destructive">Danger Zone</h2>
        <p className="text-sm text-muted-foreground mb-4">
          These actions cannot be undone. Please proceed with caution.
        </p>
        <Button variant="destructive" className="w-full">
          Delete Account
        </Button>
      </Card>
    </div>
  )
}
