import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/appwrite";
import { Query } from "node-appwrite";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { pin, account_id, type } = data;

        // Strict input validation
        if (!pin || !account_id) {
            return NextResponse.json({ error: "Missing required verification data" }, { status: 400 });
        }

        // Ensure PIN is numeric to prevent technical database errors
        if (!/^\d+$/.test(String(pin))) {
            return NextResponse.json({ error: "Incorrect PIN" }, { status: 403 });
        }

        let collectionId = process.env.USER_ACCOUNT_COLLECTION_ID
        if (type === "crypto") {
            collectionId = process.env.CRYPTO_ACCOUNT_COLLECTION_ID
        }
        const database = await connectDatabase();

        console.log(`[VerifyPIN] Checking Account: ${account_id}, PIN: ${pin}, Collection: ${collectionId}`);

        let correctPin;
        try {
            correctPin = await database.listDocuments(
                process.env.DATABASE_ID!,
                collectionId!,
                [
                    Query.equal("$id", account_id),
                    Query.equal("pin", Number(pin)),
                ]
            );
        } catch (dbError: any) {
            console.error("[VerifyPIN] Database error (Number check):", dbError.message);
            // If the numeric query fails (e.g. type mismatch in DB), we don't show the error to the user
            correctPin = { documents: [] };
        }

        // Fallback: Check if the PIN is stored as a string in the database
        if (correctPin.documents.length === 0) {
            console.log("[VerifyPIN] Number check failed, trying string check...");
            try {
                const stringPinCheck = await database.listDocuments(
                    process.env.DATABASE_ID!,
                    collectionId!,
                    [
                        Query.equal("$id", account_id),
                        Query.equal("pin", String(pin)),
                    ]
                );

                if (stringPinCheck.documents.length > 0) {
                    console.log("[VerifyPIN] String check succeeded.");
                    correctPin.documents = stringPinCheck.documents;
                }
            } catch (stringDbError: any) {
                console.error("[VerifyPIN] Database error (String check):", stringDbError.message);
            }
        }

        if (correctPin.documents.length === 0) {
            console.log("[VerifyPIN] PIN verification FAILED.");
            return NextResponse.json({ error: "Incorrect PIN" }, { status: 403 });
        }

        console.log("[VerifyPIN] PIN verification SUCCESS.");
        if (correctPin.documents[0].valid === false) {
            return NextResponse.json({ error: "Account is Restricted" }, { status: 403 });
        }

        return NextResponse.json({ message: "pin confirmed" }, { status: 200 });
    }
    catch (error: any) {
        console.error("[VerifyPIN] Unhandled error:", error.message);
        return NextResponse.json({ error: "Incorrect PIN" }, { status: 403 });
    }
}