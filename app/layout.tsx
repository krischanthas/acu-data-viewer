import type { Metadata } from "next";
import "./globals.css";
import ClientSessionWrapper from './ClientSessionWrapper';
import Navbar from "./components/Navbar";


export const metadata: Metadata = {
  title: "ACU Data Viewer",
  description: "Custom ways to view Data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClientSessionWrapper>
      <html lang="en">
        <body>
          <Navbar />
          {children}
        </body>
      </html>
    </ClientSessionWrapper>
  );
}
