import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth({
  pages: {
    signIn: "/auth/signin", // Redirect unauthenticated users to login
  },
});

// Apply the middleware only to protected routes
export const config = {
  matcher: [
    "/((?!auth|api/auth|_next/static|_next/image|favicon.ico|public/|acu-logo.jpg).*)",
  ],
};
