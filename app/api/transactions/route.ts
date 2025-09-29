import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/appwrite"; // <- your helper to connect to Appwrite
import { Query } from "node-appwrite";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId query param" }, { status: 400 });
    }

    const databases = await connectDatabase();

    // Fetch transactions for this userId
    const transactions = await databases.listDocuments(
      process.env.DATABASE_ID!,
      process.env.TRANSACTION_COLLECTION_ID!,
      [Query.equal("user_id", userId)]
    );

    const results = [];

    for (const tx of transactions.documents) {
      // Lookup useraccount by account_id from transactions
      const userAccount = await databases.getDocument(
        process.env.DATABASE_ID!,
        process.env.USER_ACCOUNT_COLLECTION_ID!,
        tx.account_id
      );

      // Parse date and time from $updatedAt
      const updatedAt = new Date(tx.$updatedAt);
      const date = updatedAt.toISOString().split("T")[0]; // YYYY-MM-DD
      const time = updatedAt.toISOString().split("T")[1].split(".")[0]; // HH:MM:SS

      // Ensure amount is number and apply minus for transfers
      let amount = Number(tx.amount);
      if (tx.type === "transfer") {
        amount = -Math.abs(amount);
      }

      results.push({
        id: tx.$id,
        description: `Transfer ${tx.type === "transfer" ? "to" : "from"} ${tx.recipient_name}`,
        amount,
        date,
        time,
        type: tx.type,
        status: tx.status,
        reference: tx.reference,
        notes: tx.memo,
        accountFrom: `${userAccount.name} ****${(tx.from).slice(-4)}`,
        accountTo: `${tx.recipient_name} ****${(tx.to).slice(-4)}`,
      });
    }

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
