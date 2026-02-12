import { createAuthClient } from "better-auth/react";
import { polarPlugin } from "./auth/plugins/polar";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  plugins: [polarPlugin()],
});

// Export from the same client instance to share cache and state
export const { signIn, signUp, useSession } = authClient;
