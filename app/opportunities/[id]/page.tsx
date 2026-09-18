import { redirect } from "next/navigation";

export default async function OpportunityAliasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/discover/opportunities/${id}`);
}
