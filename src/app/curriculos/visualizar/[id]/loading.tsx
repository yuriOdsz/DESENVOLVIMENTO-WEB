import { ListSkeleton } from "@/components/curriculo-list";
export default function Loading() {
  return (
    <div className="site-container py-12">
      <ListSkeleton />
    </div>
  );
}
