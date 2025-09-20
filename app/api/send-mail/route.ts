import { NextResponse } from "next/server";
import { buildTransactionEmail } from "@/lib/transaction";
import { createSessionClient } from "@/lib/appwrite";
import { generateCode } from "@/lib/security";
import { connectDatabase } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: Request) {
    try {
        //get the logged in user here and get the email
        const data = await request.json();
        const {account_id, recipient_name, recipient_account_number, amount, memo } = data;
        if(!recipient_name || !recipient_account_number || !amount ) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

        const { account } = await createSessionClient();
        const user =  await account.get();
        if(!user) return NextResponse.json({ error: "User not found" }, { status: 400 });
        const user_id = user.$id
        const email = user.email

        const code = generateCode();
        //save code and code generated at to db
        const database = await connectDatabase();
        
        const accounts = await database.createDocument(
            process.env.DATABASE_ID!,
            process.env.TRANSACTION_COLLECTION_ID!,
            ID.unique(),
            {
                user_id: user_id,
                from: "",
                to: recipient_account_number,
                status: "pending",
                account_id: account_id,
                code: code,
                is_verified: false,
                amount: Number(amount),
                memo: memo
            }
            
        );
        if(!accounts) return NextResponse.json({ error: "Failed to save transaction details" }, { status: 400 });

        const {subject, text, html} = buildTransactionEmail(code, recipient_name, recipient_account_number, amount);
        const mailOptions = {
            from: "agukingsley450@gmail.com",
            to: email,
            subject,
            text,
            html
        };

        const sendMail = await sgMail.send(mailOptions)
        return NextResponse.json({ message: "Email sent successfully" }, { status: 200 })
        
    } 
    catch (error: any) {
        console.error(error.response?.body || error)
        return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 })
    }
}

