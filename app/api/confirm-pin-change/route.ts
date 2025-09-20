import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/appwrite";
import { Query } from "node-appwrite";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const {pin, accounts, emailPin} = data;
        const database = await connectDatabase();
        const correctPin = await database.listDocuments(
            process.env.DATABASE_ID!,
            process.env.USER_ACCOUNT_COLLECTION_ID!,
            [
                Query.equal("pin", Number(pin)),
                Query.equal("code", Number(emailPin))
            ]
        );

        if(correctPin.documents.length === 0) throw new Error("Incorrect PIN");

        for (let i in accounts){
            const updateEmailCode = await database.updateDocument(
                process.env.DATABASE_ID!,
                process.env.USER_ACCOUNT_COLLECTION_ID!,
                accounts[i].id,
                {
                    pin: Number(pin)
                }

            )

            
            if(!updateEmailCode){
                return NextResponse.json({
                    message: "failed to update pin"
                })
            }
        }


        return NextResponse.json({ message: "pin confirmed" }, { status: 200 });
    }
     catch (error: any) {
        console.log(error.message)
        return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
    }
}