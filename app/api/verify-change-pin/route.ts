import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import { generateCode } from "@/lib/security";
import sgMail from '@sendgrid/mail';
import { createSessionClient } from "@/lib/appwrite";


sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const {pin, accounts} = data;
        if(!pin || !accounts) return NextResponse.json({message: "missing fields"})
        const database = await connectDatabase();
        if(!database){
            return NextResponse.json({message: "database failed to connect"})
        }
        const correctPin = await database.listDocuments(
            process.env.DATABASE_ID!,
            process.env.USER_ACCOUNT_COLLECTION_ID!,
            [
                Query.equal("pin", Number(pin)),
            ]
        );

        if(correctPin.documents.length === 0) throw new Error("Incorrect PIN");

         const { account } = await createSessionClient();
        const user =  await account.get();
        if(!user) return NextResponse.json({ error: "User not found" }, { status: 400 });
        const email = user.email
        

        const code = generateCode();

// update the database here

        for (let i in accounts){
            const updateEmailCode = await database.updateDocument(
                process.env.DATABASE_ID!,
                process.env.USER_ACCOUNT_COLLECTION_ID!,
                accounts[i].id,
                {
                    code: Number(code)
                }

            )

            
            if(!updateEmailCode){
                return NextResponse.json({
                    message: "failed to update email"
                })
            }
        }
        


        const mailOptions = {
            from: "agukingsley450@gmail.com",
            to: email,
            subject: "Request To Change PIN",
            text: `use this code ${code}to confirm change of pin`,
        };
        
        const sendMail = await sgMail.send(mailOptions)

        return NextResponse.json({ message: "pin confirmed" }, { status: 200 });
    }
     catch (error: any) {
        console.log(error.message)
        return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
    }
}