import { Inter } from "next/font/google";
import "./globals.css";
// import { Toaster } from "@/components/ui/toaster";
import StoreProvider from "@/lib/redux/storeProvider";
import Navbar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Product Management App",
  description: "Manage your products efficiently",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-light min-h-screen`}>
        <StoreProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          {/* <Toaster /> */}
        </StoreProvider>
      </body>
    </html>
  );
}
