import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/appwrite";
import { Query } from "node-appwrite";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const {pin, account_id} = data;
        const database = await connectDatabase();
        const correctPin = await database.listDocuments(
            process.env.DATABASE_ID!,
            process.env.USER_ACCOUNT_COLLECTION_ID!,
            [
                Query.equal("$id", account_id),
                Query.equal("pin", Number(pin)),
            ]
        );

        if(correctPin.documents.length === 0) throw new Error("Incorrect PIN");

        return NextResponse.json({ message: "pin confirmed" }, { status: 200 });
    }
     catch (error: any) {
        console.log(error.message)
        return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
    }
}