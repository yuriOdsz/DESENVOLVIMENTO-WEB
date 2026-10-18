import { Suspense } from "react";
import Form from "@/components/form-loader";
import { ListSkeleton } from "@/components/curriculo-list";
export const metadata = { title: "Cadastro de currículo" };
export default function Page() {
  return (
    <div className="site-container py-10">
      <Suspense fallback={<ListSkeleton />}>
        <Form />
      </Suspense>
    </div>
  );
}
