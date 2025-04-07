"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import type { Session } from "next-auth";

interface Props {
    children: ReactNode;
    session: Session | null;
}

export default function ClientSessionWrapper({ children, session }: Props) {
    return <SessionProvider session={session}>{children}</SessionProvider>;
}
