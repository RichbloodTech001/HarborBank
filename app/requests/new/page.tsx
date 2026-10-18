import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/security";
import { PortalShell } from "@/components/portal-shell";
import { RequestForm } from "@/components/request-form";
export default async function NewRequestPage({ searchParams }: { searchParams: Promise<{ accountId?: string }> }) { const user=await currentUser();if(!user)redirect("/login");const params=await searchParams;const accounts=await prisma.bankAccount.findMany({where:{userId:user.id,status:"ACTIVE"},select:{id:true,label:true,accountNumber:true,currency:true},orderBy:{createdAt:"asc"}});const initialAccountId=accounts.some((account)=>account.id===params.accountId)?params.accountId:accounts[0]?.id;return <PortalShell name={user.name} role={user.role}><h1 className="portal-title">Create a request</h1><p className="portal-subtitle">Submit a deposit or withdrawal request for review. The form does not initiate payments or transfer funds.</p>{accounts.length ? <RequestForm accounts={accounts} initialAccountId={initialAccountId}/> : <div className="portal-card portal-empty">No active account record is available for this profile.</div>}</PortalShell>; }
