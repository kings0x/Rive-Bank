import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/appwrite";
import { Query } from "node-appwrite";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const {account_id, recipient_account_number, recipient_name, routing_number, amount} = data;
        const database = await connectDatabase();

        const sender_details = await database.listDocuments(
            process.env.DATABASE_ID!,
            process.env.USER_ACCOUNT_COLLECTION_ID!,
            [
                Query.equal("$id", account_id),
            ]
        );

        if(sender_details.documents.length === 0) {
            return NextResponse.json({ message: "Sender details not found" }, { status: 400 });
        }

        const sender_account = sender_details.documents[0];

        if(sender_account.balance < amount) {
            return NextResponse.json({ message: "Insufficient balance" }, { status: 400 });
        }



        return NextResponse.json({ message: "Transactions validated successfully" }, { status: 200 });
    }
     catch (error: any) {
        console.log(error.message)
        return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
    }
}