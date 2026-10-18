import CurriculoDetail from "@/components/curriculo-detail";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="site-container py-10">
      <CurriculoDetail id={id} />
    </div>
  );
}
