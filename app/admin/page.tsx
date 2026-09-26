import { redirect } from "next/navigation";
import { currentAdmin } from "@/lib/admin";
import { AdminDashboard } from "@/components/admin";
export default async function AdminPage() { const admin = await currentAdmin(); if (!admin) redirect("/admin/login"); return <AdminDashboard username={admin.username}/>; }
