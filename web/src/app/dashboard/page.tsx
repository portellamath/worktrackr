import { AuthGuard } from "@/components/AuthGuard";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <main style={{ padding: 40 }}>
        <h1>Dashboard</h1>
        <p>Overview of projects, tasks and deadlines</p>
      </main>
    </AuthGuard>
  );
}
