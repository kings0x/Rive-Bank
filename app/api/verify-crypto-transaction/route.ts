// pages/api/verify-amount.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';
import { connectDatabase } from '@/lib/appwrite';
import { Query } from 'node-appwrite';
import { NextResponse } from 'next/server';
import { getLoggedInUser } from '@/lib/appwrite';

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);


export async function POST(req: Request, res: NextApiResponse) {

const databases = await connectDatabase();
  try {
    const data = await req.json()
    const { userId, symbol, amount } = data;

    if (!userId || !symbol || !amount) {
      return NextResponse.json({ error: `${userId}, ${symbol}, ${amount}` }, {status: 400});
    }

    const user = await getLoggedInUser()

    if(!user){
        return NextResponse.json({ error: 'User not Logged in' }, {status: 400});
    }

    const email = user?.email
    // Fetch user balance from Appwrite
    const collectionId = process.env.APPWRITE_COLLECTION_ID!;
    const checkAccount = await databases.listDocuments(
        process.env.DATABASE_ID!,
        process.env.CRYPTO_ACCOUNT_COLLECTION_ID!,
        [
            Query.equal("user_id", userId),
            Query.equal("symbol", symbol)
        ]
    );


    if (!checkAccount) {
      return NextResponse.json({ error: `No balance found for ${symbol}` }, {status: 400});
    }

    const acctDetails = checkAccount.documents[0]
    const accountId = acctDetails.$id
    const balance = parseFloat(acctDetails.balance);

    // Check if amount > 97% of balance
    if (Number(amount) > balance * 0.97) {
      return NextResponse.json({ error: 'Insufficient Balance' }, {status: 400});
    }

    // Generate dummy 6-digit code
    // const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Update the code in Appwrite document
    // await databases.updateDocument(
    //     process.env.DATABASE_ID!,
    //     process.env.CRYPTO_ACCOUNT_COLLECTION_ID!, 
    //     accountId, 
    //     { code : Number(code)}
    // );

    // const mailOptions = {
    //             from: "agukingsley450@gmail.com",
    //             to: email,
    //             subject: "Code for Crypto Transaction",
    //             text: `your 6 digit code for your crypto transaction is ${code}`
    // };
    
    // const sendMail = await sgMail.send(mailOptions)


    return NextResponse.json({ success: true}, {status: 200}); // optional: return code for testing

  } 

  catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, {status: 500});
  }


}
