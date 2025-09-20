// src/lib/server/appwrite.js
"use server";
import { createSessionClient, createAdminClient } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";




export async function POST(req: Request) {
    try{
        const data = await req.json()
        const { email, password } = data
        const { account } = await createAdminClient();

        const session = await account.createEmailPasswordSession(email, password);

        const cookieStore = await cookies();
        cookieStore.set("my-custom-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return NextResponse.json({ message: "user logged in successfully" }, { status: 200 });
    }

    catch(error: any){
        return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
    }
    
}

export async function GET(req: NextRequest) {
    try{
        const { account } = await createSessionClient();
        const user =  await account.get();
        if(!user) throw new Error("User not found");

        return NextResponse.json({ message: "user logged in successfully", data: user }, { status: 200 });

    }
    catch(error: any){
        return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
    }
    
}