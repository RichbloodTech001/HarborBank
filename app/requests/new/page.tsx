import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/security";
import { PortalShell } from "@/components/portal-shell";
import { RequestForm } from "@/components/request-form";
export default async function NewRequestPage() { const user=await currentUser(); if(!user) redirect("/login"); const accounts=await prisma.bankAccount.findMany({where:{userId:user.id,status:"ACTIVE"},select:{id:true,label:true,accountNumber:true,currency:true},orderBy:{createdAt:"asc"}}); return <PortalShell name={user.name} role={user.role}><h1 className="portal-title">Create a request</h1><p className="portal-subtitle">Submit a deposit or withdrawal request for review. The form does not initiate payments or transfer funds.</p>{accounts.length ? <RequestForm accounts={accounts}/> : <div className="portal-card portal-empty">No active account record is available for this profile.</div>}</PortalShell>; }
