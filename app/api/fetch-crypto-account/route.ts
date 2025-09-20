import { NextResponse } from "next/server";
import { getLoggedInUser, connectDatabase } from "@/lib/appwrite";
import { Query } from "node-appwrite";
export async function GET(req:Request) {
    try{
        const user = await getLoggedInUser();
        if(!user) return NextResponse.json({ error: "User not found" }, { status: 400 });

        const database = await connectDatabase();
        const userId = user?.$id;

        const accounts = await database.listDocuments(
            process.env.DATABASE_ID!,
            process.env.CRYPTO_ACCOUNT_COLLECTION_ID!,
            [
                Query.equal("user_id", userId),
            ]
        );

        if(!accounts) return NextResponse.json({ error: "Accounts not found" }, { status: 400 });

        const cryptoAccounts = accounts.documents;

        return NextResponse.json({ message: cryptoAccounts }, { status: 200 });
    }

    catch(error: any){
        NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
    }
    
}