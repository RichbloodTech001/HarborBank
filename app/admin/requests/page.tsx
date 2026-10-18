import {redirect} from "next/navigation";
import {currentUser} from "@/lib/security";
import {PortalShell} from "@/components/portal-shell";
import {AdminRequests} from "@/components/admin-requests";
export default async function AdminRequestsPage(){const user=await currentUser();if(!user)redirect("/login");if(user.role!=="ADMIN")redirect("/dashboard");return <PortalShell name={user.name} role={user.role}><h1 className="portal-title">Request review</h1><p className="portal-subtitle">Review pending deposit and withdrawal requests. Decisions update request workflow status only.</p><AdminRequests/></PortalShell>}
