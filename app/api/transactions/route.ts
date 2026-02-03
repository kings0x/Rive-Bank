import { NextResponse } from "next/server";
import { createSessionClient, getLoggedInUser } from "@/lib/appwrite";
import { Query } from "node-appwrite";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId query param" }, { status: 400 });
    }

    // Security check: Ensure the requested userId matches the logged-in user
    const user = await getLoggedInUser();
    if (!user || user.$id !== userId) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { databases } = await createSessionClient();

    // Fetch all user accounts once to avoid N+1 lookups
    const userAccountsResponse = await databases.listDocuments(
      process.env.DATABASE_ID!,
      process.env.USER_ACCOUNT_COLLECTION_ID!,
      [Query.equal("user_id", userId)]
    );

    // Create a map of accountId -> account name
    const accountMap = new Map();
    userAccountsResponse.documents.forEach((acc: any) => {
      accountMap.set(acc.$id, acc.name);
    });

    // Fetch transactions for this userId
    const transactions = await databases.listDocuments(
      process.env.DATABASE_ID!,
      process.env.TRANSACTION_COLLECTION_ID!,
      [
        Query.equal("user_id", userId),
        Query.equal("is_verified", true),
        Query.orderDesc("$createdAt"), // Optionally order by most recent
        Query.limit(100) // Safety limit
      ]
    );

    const results = transactions.documents.map((tx: any) => {
      // Lookup useraccount name from map
      const accountName = accountMap.get(tx.account_id) || "Unknown Account";

      // Parse date and time from $updatedAt (or $createdAt)
      const updatedAt = new Date(tx.$createdAt);
      const date = updatedAt.toISOString().split("T")[0];
      const time = updatedAt.toISOString().split("T")[1].split(".")[0];

      // Ensure amount is number and apply minus for transfers
      let amount = Number(tx.amount);
      if (tx.type === "transfer") {
        amount = -Math.abs(amount);
      }

      return {
        id: tx.$id,
        description: `Transfer ${tx.type === "transfer" ? "to" : "from"} ${tx.recipient_name}`,
        amount,
        date,
        time,
        type: tx.type,
        status: tx.status,
        reference: tx.reference,
        notes: tx.memo,
        accountFrom: `${accountName} ****${(tx.from || "").slice(-4)}`,
        accountTo: `${tx.recipient_name} ****${(tx.to || "").slice(-4)}`,
      };
    });

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
