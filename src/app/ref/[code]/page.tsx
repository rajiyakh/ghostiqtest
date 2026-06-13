import { redirect } from "next/navigation";

export default async function RefRedirect({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  redirect(`/dashboard?ref=${encodeURIComponent(code)}`);
}
