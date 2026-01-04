import Link from "next/link";
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
        <nav style={{ padding: 20, borderBottom: "1px solid #ccc" }}>
          <Link href="/dashboard">Dashboard</Link> |{" "}
          <Link href="/projects">Projects</Link> |{" "}
          <Link href="/login">Login</Link>
        </nav>
        <main style={{ padding: 40 }}>
          {children}
        </main>
        </AuthProvider>
      </body>
    </html>
  );
}
