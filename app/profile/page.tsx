import { redirect } from "next/navigation";
import { currentUser } from "@/lib/security";
import { PortalShell } from "@/components/portal-shell";
import { ProfileForm } from "@/components/profile-form";
export default async function ProfilePage(){const user=await currentUser();if(!user)redirect("/login");return <PortalShell name={user.name} role={user.role}><h1 className="portal-title">Profile settings</h1><p className="portal-subtitle">Manage your display name and review the role attached to this profile.</p><ProfileForm name={user.name} email={user.email} role={user.role}/></PortalShell>}
