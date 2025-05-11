import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "./provider/AuthContext"
import { AnimatePresence, motion } from 'framer-motion'
import ReactQueryProvider from "@/app/provider/ReactQueryProvider"



const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hệ Thống Đánh Giá Sản Phẩm",
  description: "Hệ thống đánh giá sản phẩm tiêu dùng",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <Toaster />
          <div className="flex min-h-screen flex-col">
            <AuthProvider>
              <ReactQueryProvider>
              <Header />
              <main className="flex-1">

                {children}

              </main>
              <Footer />
            </ReactQueryProvider>
            </AuthProvider>
          </div>
        </ThemeProvider>
       
      </body>
    </html>
  )
}
