import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HelpPage() {
  return (
    <div className="flex flex-col">
      <SiteHeader title="Help" />

      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Help & Documentation</CardTitle>
            <CardDescription>
              Learn how to build and manage workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Documentation coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
