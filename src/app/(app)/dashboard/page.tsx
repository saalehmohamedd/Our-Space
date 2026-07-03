import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const result = await auth();

  return (
    <pre>{JSON.stringify(result, null, 2)}</pre>
  );
}