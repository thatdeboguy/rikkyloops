import { redirect } from "next/navigation";
import { currentAdmin } from "@/lib/admin";
import { AdminLogin } from "@/components/admin";
export default async function LoginPage() { if (await currentAdmin()) redirect("/admin"); return <AdminLogin/>; }
