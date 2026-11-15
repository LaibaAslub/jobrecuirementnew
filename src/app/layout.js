import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import Navbar from "@/components/Navbar";
import ScrollAnimationObserver from "@/components/animations/ScrollAnimationObserver";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RecruitMe | Online Recruitment System",
  description: "RecruitMe: Online Recruitment System — connecting talent with opportunity.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <DataProvider>
            <ScrollAnimationObserver />
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
            </div>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
