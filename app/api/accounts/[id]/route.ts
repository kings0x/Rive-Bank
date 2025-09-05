import { NextRequest, NextResponse } from "next/server";
import { connectDatabase } from "@/lib/appwrite";
import { Query } from "node-appwrite";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try{
        const { id } = params;
        if(!id){
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }
        const database = await connectDatabase();

        const accounts = await database.listDocuments(
            process.env.DATABASE_ID!,
            process.env.USER_ACCOUNT_COLLECTION_ID!,
            [Query.equal("user_id", [id])] 
        );
        const record = accounts.documents[0];

        return NextResponse.json({message: "Accounts fetched successfully", data: accounts.documents}, {status: 200});
    }
    catch(error: any){
        return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
    }
    
}