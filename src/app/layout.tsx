import AuthProvider from "@/components/auth/auth-provider";
import { Inter } from 'next/font/google';
import "./globals.css";
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import Sidebar from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} relative bg-neutral-950`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-screen relative">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <main className="flex-1 max-w-3xl w-full mx-auto mt-12 px-4">
                  {children}
                </main>
                <Toaster />
              </div>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}