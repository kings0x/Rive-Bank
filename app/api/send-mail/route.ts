import { NextResponse } from "next/server";
import { buildTransactionEmail } from "@/lib/transaction";
import { createSessionClient } from "@/lib/appwrite";
import { generateCode } from "@/lib/security";
import { connectDatabase } from "@/lib/appwrite";
import { ID, Query } from "node-appwrite";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { account_id, recipient_name, recipient_account_number, amount, memo, pin, type } = data;

        if (!pin) return NextResponse.json({ error: "Transaction PIN is required" }, { status: 400 });
        if (!recipient_name || !recipient_account_number || !amount) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

        const { account } = await createSessionClient();
        const user = await account.get();
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 400 });

        const database = await connectDatabase();

        let collectionId = process.env.USER_ACCOUNT_COLLECTION_ID
        if (type === "crypto") {
            collectionId = process.env.CRYPTO_ACCOUNT_COLLECTION_ID
        }

        console.log(`[PIN Check] Account: ${account_id}, PIN: ${pin}, Type: ${type}, Collection: ${collectionId}`)

        // Strict numeric check to avoid Appwrite query errors
        if (!/^\d+$/.test(String(pin))) {
            return NextResponse.json({ error: "Incorrect Transaction PIN" }, { status: 403 });
        }

        let pinCheck;
        try {
            pinCheck = await database.listDocuments(
                process.env.DATABASE_ID!,
                collectionId!,
                [
                    Query.equal("$id", account_id),
                    Query.equal("pin", Number(pin)),
                ]
            );
        } catch (dbError: any) {
            console.error("[PIN Check] Database error:", dbError.message);
            return NextResponse.json({ error: "Incorrect Transaction PIN" }, { status: 403 });
        }

        console.log(`[PIN Check] Found documents: ${pinCheck.documents.length}`)

        if (pinCheck.documents.length === 0) {
            return NextResponse.json({ error: "Incorrect Transaction PIN" }, { status: 403 });
        }

        const senderAccount = pinCheck.documents[0];
        if (senderAccount.valid === false) {
            return NextResponse.json({ error: "Account has been restricted. Please contact support." }, { status: 403 });
        }

        const user_id = user.$id
        const email = user.email

        const code = generateCode();

        const pendingTx = await database.createDocument(
            process.env.DATABASE_ID!,
            process.env.TRANSACTION_COLLECTION_ID!,
            ID.unique(),
            {
                user_id: user_id,
                from: "",
                to: recipient_account_number,
                status: "pending",
                account_id: account_id,
                recipient_name: recipient_name,
                code: code,
                is_verified: false,
                amount: Number(amount),
                memo: memo
            }
        );

        if (!pendingTx) return NextResponse.json({ error: "Failed to save transaction details" }, { status: 400 });

        const { subject, text, html } = buildTransactionEmail(code, recipient_name, recipient_account_number, amount);

        // --- Configure Nodemailer with App Password ---
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.GMAIL_APP_PASSWORD,
            }
        });

        const mailOptions = {
            from: `"Rive Bank Support" <${process.env.SENDER_EMAIL}>`,
            to: email,
            subject,
            text,
            html
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Verification email sent to ${email}`);
        } catch (mailError: any) {
            console.error("Nodemailer failed:", mailError);

            // Rollback the pending transaction
            await database.deleteDocument(
                process.env.DATABASE_ID!,
                process.env.TRANSACTION_COLLECTION_ID!,
                pendingTx.$id
            ).catch(err => console.error("Rollback failed:", err));

            return NextResponse.json({
                error: `Email service failure: ${mailError.message}`,
                details: "Check your Google OAuth2 credentials in .env"
            }, { status: 500 });
        }

        return NextResponse.json({ message: "Email sent successfully" }, { status: 200 })

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 })
    }
}

