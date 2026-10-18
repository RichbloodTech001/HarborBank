import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
export async function GET(){try{await prisma.$queryRaw`SELECT 1`;return NextResponse.json({status:"ok",mode:"demo",database:"connected",financialOperations:"disabled",timestamp:new Date().toISOString()});}catch{return NextResponse.json({status:"degraded",mode:"demo",database:"unavailable",financialOperations:"disabled"}, {status:503});}}
