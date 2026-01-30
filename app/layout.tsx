import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { AuthLayoutWrapper } from "@/components/auth-layout-wrapper"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
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
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased text-sm`}>
        <AuthProvider>
          <AuthLayoutWrapper>{children}</AuthLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}
