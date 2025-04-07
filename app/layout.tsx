import type { Metadata } from "next";
import "./globals.css";
import ClientSessionWrapper from "./ClientSessionWrapper";
import { authOptions } from "@/lib/auth"; // Import auth function
import { getServerSession } from "next-auth"; // Import getServerSession
import Navbar from "./components/Navbar";
export const metadata: Metadata = {
  title: "ACU Data Viewer",
  description: "Custom ways to view Data",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions); // Use getServerSession

  return (
    <ClientSessionWrapper session={session}>
      <html lang="en">
        <body>
          <Navbar />
          {children}
        </body>
      </html>
    </ClientSessionWrapper>

  );
}
