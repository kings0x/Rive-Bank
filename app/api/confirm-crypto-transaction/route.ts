// pages/api/verify-amount.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';
import { connectDatabase } from '@/lib/appwrite';
import { Query } from 'node-appwrite';
import { NextResponse } from 'next/server';
import { getLoggedInUser } from '@/lib/appwrite';


export async function POST(req: Request, res: NextApiResponse) {

const databases = await connectDatabase();
  try {
    const data = await req.json()
    const { userId, symbol, amount, pin } = data;

    if (!userId || !symbol || !pin ||!amount) {
      return NextResponse.json({ error: `Missing fields` }, {status: 400});
    }

    const checkAccount = await databases.listDocuments(
        process.env.DATABASE_ID!,
        process.env.CRYPTO_ACCOUNT_COLLECTION_ID!,
        [
            Query.equal("user_id", userId),
            Query.equal("symbol", symbol),
            Query.equal("pin", Number(pin))
        ]
    );


    if (!checkAccount) {
      return NextResponse.json({ error: `Incorrect Pin` }, {status: 400});
    }

    const acctDetails = checkAccount.documents[0]
    const accountId = acctDetails.$id
    const balance = parseFloat(acctDetails.balance);


    // Update the code in Appwrite document
    const sendTransaction = await databases.updateDocument(
        process.env.DATABASE_ID!,
        process.env.CRYPTO_ACCOUNT_COLLECTION_ID!, 
        accountId, 
        { balance : balance - Number(amount)}
    );

    if(!sendTransaction){
        return NextResponse.json({ error: `Transaction failed` }, {status: 400});
    }

    //now create the transaction document



    return NextResponse.json({ success: true }, {status: 200}); // optional: return code for testing

  } 

  catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, {status: 500});
  }


}
