import { getCurrentUserOrThrow } from "@/lib/auth-guard";

export default async function DashboardPage() {
  const user = await getCurrentUserOrThrow();

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard works!</h1>
      <p>{user.name}</p>
      <p>{user.email}</p>
    </div>
  );
}