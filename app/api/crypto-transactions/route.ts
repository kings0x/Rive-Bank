// app/api/transactions/route.ts
import { NextResponse } from "next/server"
import { Query } from "node-appwrite"
import { connectDatabase } from "@/lib/appwrite"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    const databases = await connectDatabase();
    const databaseId = process.env.DATABASE_ID!
    const collectionId = process.env.CRYPTO_TRANSACTION_COLLECTION_ID!

    // Build query: match userId and order by createdAt desc
    const queries: any[] = [Query.equal("user_id", userId), Query.orderDesc("$createdAt")]


    // Call listDocuments. If your SDK version supports limit as an options param, pass it as the 4th arg.
    // The call signature might slightly differ across SDK versions; adapt if needed.
    const response = await databases.listDocuments(databaseId, collectionId, queries)

    const transactions = (response.documents || response).map((d: any) => ({
      id: d.$id ?? d.id ?? d._id,
      name: d.type ?? (d.amount && Number(d.amount) > 0 ? "receive" : "send"),
      symbol: d.symbol ?? d.token ?? "UNKNOWN",
      amount: d.type === "receive" ? + Number(d.amount ?? 0) : - Number(d.amount ?? 0),
      usdValue: Number(d.usdValue ?? d.value ?? 0),
      date: d.$createdAt ?? d.date ?? null,
      hash: d.hash ?? d.txHash ?? null,
      raw: d,
    }))

    return NextResponse.json({ transactions }, { status: 200 })

  } 
  catch (err: any) {
    console.error("Appwrite fetch error:", err)
    return NextResponse.json({ error: err?.message ?? "Failed to fetch transactions" }, { status: 500 })
  }
}
