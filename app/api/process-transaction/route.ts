import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import { generateReference } from "@/lib/transaction";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { account_id, emailCode } = data;
    if (!emailCode || !account_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }


    const database = await connectDatabase();

    const transaction = await database.listDocuments(
      process.env.DATABASE_ID!,
      process.env.TRANSACTION_COLLECTION_ID!,
      [ Query.equal("code", emailCode), Query.equal("is_verified", false) ]
    );

    if (!transaction?.documents || transaction.documents.length === 0) {
    //   console.warn("No matching transaction for code", emailCode);
      return NextResponse.json({ error: "Invalid or already used code" }, { status: 400 });
    }

    const txDoc = transaction.documents[0];
    // console.log("txDoc:", txDoc);
    const transaction_id = txDoc.$id;
    const amount = Number(txDoc.amount);
    const recipient_account_number = txDoc.to;

    // Defensive checks for required tx fields
    if (!recipient_account_number) {
    //   console.warn("Transaction missing recipient_account_number", { transaction_id, txDoc });
    //   // optional: flag the tx as failed so it isn't left hanging
      await database.updateDocument(
        process.env.DATABASE_ID!,
        process.env.TRANSACTION_COLLECTION_ID!,
        transaction_id,
        { is_verified: true, status: "failed" }
      );
      return NextResponse.json({ error: "Recipient account number missing from transaction" }, { status: 400 });
    }

    if (!amount || isNaN(amount) || amount <= 0) {
    //   console.warn("Transaction has invalid amount", txDoc);
      return NextResponse.json({ error: "Invalid transaction amount" }, { status: 400 });
    }

    // get sender (account) by id
    const accountResult = await database.listDocuments(
      process.env.DATABASE_ID!,
      process.env.USER_ACCOUNT_COLLECTION_ID!,
      [Query.equal("$id", account_id)]
    );

    if (!accountResult?.documents || accountResult.documents.length === 0) {
    //   console.warn("Sender account not found", account_id);
      return NextResponse.json({ error: "Account not found" }, { status: 400 });
    }

    const sender = accountResult.documents[0];
    const senderBalance = Number(sender.balance);
    const accountNumber = sender.account_number;
    const senderAccountNumber = `****${accountNumber.slice(-4)}`;

    if (isNaN(senderBalance)) {
    //   console.warn("Sender balance invalid", sender);
      return NextResponse.json({ error: "Invalid sender account balance" }, { status: 400 });
    }

    if (senderBalance < amount) {
      return NextResponse.json({ error: "Insufficient funds" }, { status: 400 });
    }

    // Update sender balance (deduct)
    const updatedSender = await database.updateDocument(
      process.env.DATABASE_ID!,
      process.env.USER_ACCOUNT_COLLECTION_ID!,
      account_id,
      { balance: senderBalance - amount }
    );

    if (!updatedSender) {
      await database.updateDocument(
        process.env.DATABASE_ID!,
        process.env.TRANSACTION_COLLECTION_ID!,
        transaction_id,
        { is_verified: true, status: "failed" }
      );
      return NextResponse.json({ error: "Transaction did not go through (sender update failed)" }, { status: 400 });
    }

    // find recipient account by account_number field
    const recipientQuery = await database.listDocuments(
      process.env.DATABASE_ID!,
      process.env.USER_ACCOUNT_COLLECTION_ID!,
      [Query.equal("account_number", recipient_account_number)]
    );

    if (!recipientQuery?.documents || recipientQuery.documents.length === 0) {
    //   console.warn("Recipient account not found", recipient_account_number);
      await database.updateDocument(
        process.env.DATABASE_ID!,
        process.env.TRANSACTION_COLLECTION_ID!,
        transaction_id,
        { is_verified: true, status: "failed" }
      );
      return NextResponse.json({ error: "Recipient account not found" }, { status: 400 });
    }

    const recipientDoc = recipientQuery.documents[0];
    const recipientId = recipientDoc.$id;
    const recipientBalance = Number(recipientDoc.balance) || 0;

    const updatedRecipient = await database.updateDocument(
      process.env.DATABASE_ID!,
      process.env.USER_ACCOUNT_COLLECTION_ID!,
      recipientId,
      { balance: recipientBalance + amount }
    );

    if (!updatedRecipient) {
      await database.updateDocument(
        process.env.DATABASE_ID!,
        process.env.TRANSACTION_COLLECTION_ID!,
        transaction_id,
        { is_verified: true, status: "failed" }
      );
      return NextResponse.json({ error: "Transaction did not go through (recipient update failed)" }, { status: 400 });
    }
    const reference_number = generateReference();
    //update the transaction
    await database.updateDocument(
      process.env.DATABASE_ID!,
      process.env.TRANSACTION_COLLECTION_ID!,
      transaction_id,
      { 
        is_verified: true, 
        status: "completed",
        from: senderAccountNumber, 
        type: "transfer",
      }
    );
    //do that every transfer that the type is transfer would have a minus applied on the account

    return NextResponse.json({ message: "Email verified & Transaction processed successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("process-transaction error:", error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}
