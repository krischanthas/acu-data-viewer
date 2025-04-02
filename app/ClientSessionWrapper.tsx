// app/ClientSessionWrapper.tsx
"use client"; // This makes it a Client Component

import { SessionProvider } from "next-auth/react"; // Import SessionProvider
import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    session?: any;
}

export default function ClientSessionWrapper({ children, session }: Props) {
    return <SessionProvider session={session}>{children}</SessionProvider>;
}
