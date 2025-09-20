import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/appwrite";
import { Query } from "node-appwrite";
export async function POST(req: Request) {
  const { emailPin, pin } = await req.json();
  if(!emailPin || !pin) return NextResponse.json({message: "Missing request"})
  try {

    const database = await connectDatabase();
    const correctEmailCode = await database.listDocuments(
        process.env.DATABASE_ID!,
        process.env.USER_ACCOUNT_COLLECTION_ID!,
        [
            Query.equal("pin", Number(pin)),
            Query.equal("code", Number(emailPin))
        ]
    );
    
    if(correctEmailCode.documents.length === 0) throw new Error("Incorrect EmailCode or Pin");
    
    return NextResponse.json({
         ok: true 
    });
  } catch (err:any) {
    return NextResponse.json({ error: err.message || 'failed' }, { status: 400 });
  }
}