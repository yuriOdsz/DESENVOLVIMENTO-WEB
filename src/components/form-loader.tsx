"use client";
import dynamic from "next/dynamic";
import { ListSkeleton } from "./curriculo-list";
const Form = dynamic(() => import("./curriculo-form"), {
  ssr: false,
  loading: () => <ListSkeleton />,
});
export default Form;
