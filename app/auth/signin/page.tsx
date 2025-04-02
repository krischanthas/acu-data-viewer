"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SignIn = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    console.log(session);
    useEffect(() => {
        if (status === "authenticated") {
            router.push("/"); // Redirect to home
        }
    }, [session, status, router]); // Depend on session, status, and router

    if (status === "loading") {
        return <div>Loading...</div>; // Show a loading state
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <img src="/acu-logo.jpg" alt="Elevated" className="w-50" />
            <div className="bg-white p-8 rounded-lg shadow-lg">
                {/* <h2 className="text-2xl mb-4">Sign In</h2> */}
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => signIn("azure-ad")}
                >
                    Sign in with Microsoft
                </button>
            </div>
        </div>
    );
};

export default SignIn;

