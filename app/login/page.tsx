import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/security";
import { LoginForm } from "@/components/auth-forms";
export const metadata: Metadata = { title: "Sign in" };
export default async function LoginPage() { if (await currentUser()) redirect("/dashboard"); return <main className="portal-auth-wrap"><aside className="portal-auth-aside"><Link className="brand" href="/"><span className="brand-mark">HB</span><span>Harbor<span>Bank</span></span></Link><div><div className="eyebrow eyebrow-light"><span className="eyebrow-line"/> WELCOME BACK</div><h1>Your money.<br/><span>Your next move.</span></h1><p>Sign in to review your profile and track your submitted requests in one clear place.</p></div><div className="portal-footer">HarborBank is a prototype. Real-money services are not enabled.</div></aside><section className="portal-auth-main"><div className="portal-auth-form"><Link className="portal-link" href="/">← Back to homepage</Link><h2>Sign in</h2><p>Enter your HarborBank account details to continue.</p><LoginForm/><div className="portal-smallprint">Never share your password or verification codes. If you do not have a profile yet, <Link className="portal-link" href="/register">create one here</Link>.</div></div></section></main>; }
