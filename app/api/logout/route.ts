import { NextResponse } from "next/server";
import { createSessionClient } from "@/lib/appwrite";
import { cookies } from "next/headers";


export async function POST(req: Request) {
    try{
        
        const { account } = await createSessionClient();
        const cookieStore = await cookies();

        cookieStore.delete("my-custom-session");
        await account.deleteSession("current");

        return NextResponse.json({ message: "user logged out successfully" }, { status: 200 });
    }

    catch(error: any){
        return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
    }
    
}