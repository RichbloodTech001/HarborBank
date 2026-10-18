import { redirect } from "next/navigation";
import { currentUser } from "@/lib/security";
import { PortalShell } from "@/components/portal-shell";
import { ProfileForm } from "@/components/profile-form";
import { PasswordChangeForm } from "@/components/password-change-form";
export default async function ProfilePage(){const user=await currentUser();if(!user)redirect("/login");return <PortalShell name={user.name} role={user.role}><h1 className="portal-title">Profile settings</h1><p className="portal-subtitle">Manage your display name and review the role attached to this profile.</p><ProfileForm name={user.name} email={user.email} role={user.role}/><div className="portal-card" style={{ marginTop: 24 }}><PasswordChangeForm /></div></PortalShell>}
