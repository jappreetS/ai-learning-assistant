import type { Metadata } from "next";
import { SessionsScreen } from "@/components/sessions/SessionsScreen";

export const metadata: Metadata = { title: "Sessions" };

export default function SessionsPage() {
  return <SessionsScreen />;
}