import {redirect} from "next/navigation";
import {currentUser} from "@/lib/security";
import {PortalShell} from "@/components/portal-shell";
import {AdminCustomers} from "@/components/admin-customers";
export default async function AdminCustomersPage(){const user=await currentUser();if(!user)redirect("/login");if(user.role!=="ADMIN")redirect("/dashboard");return <PortalShell name={user.name} role={user.role}><h1 className="portal-title">Customer management</h1><p className="portal-subtitle">Search profiles and suspend or restore customer sign-in access. Actions are recorded in the audit log.</p><AdminCustomers/></PortalShell>}
