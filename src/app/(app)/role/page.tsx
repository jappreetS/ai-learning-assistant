import type { Metadata } from "next";
import { TargetRoleForm } from "@/components/role/TargetRoleForm";

export const metadata: Metadata = { title: "Target role" };

export default function TargetRolePage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-8 sm:py-10">
      <h1 className="text-3xl font-bold tracking-tight">Target role</h1>
      <p className="mt-3 max-w-xl text-muted">
        Choose how you want to describe the role.
      </p>
      <TargetRoleForm />
    </main>
  );
}