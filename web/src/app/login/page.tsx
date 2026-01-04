"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  function handleLogin() {
    login();
    router.push("/dashboard");
  }

  return (
    <main>
      <h1>Login</h1>
      <button onClick={handleLogin}>
        Fake Login
      </button>
    </main>
  );
}
