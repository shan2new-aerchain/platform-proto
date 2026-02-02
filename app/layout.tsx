import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { AuthLayoutWrapper } from "@/components/auth-layout-wrapper"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-brand",
})

export const metadata: Metadata = {
  title: "Platform",
  description: "Configure workflows for your applications",
  icons: {
    icon: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${montserrat.variable} font-sans antialiased text-sm`}>
        <ThemeProvider defaultTheme="system" storageKey="workflows-theme">
          <AuthProvider>
            <AuthLayoutWrapper>{children}</AuthLayoutWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
