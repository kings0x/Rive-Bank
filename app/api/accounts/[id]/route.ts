import { NextRequest, NextResponse } from "next/server";
import { createSessionClient, getLoggedInUser } from "@/lib/appwrite";
import { Query } from "node-appwrite";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Security check: Ensure the requested id matches the logged-in user
        const user = await getLoggedInUser();
        if (!user || user.$id !== id) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
        }

        const { databases } = await createSessionClient();

        const accounts = await databases.listDocuments(
            process.env.DATABASE_ID!,
            process.env.USER_ACCOUNT_COLLECTION_ID!,
            [Query.equal("user_id", [id])]
        );

        return NextResponse.json({ message: "Accounts fetched successfully", data: accounts.documents }, { status: 200 });
    }
    catch (error: any) {
        console.error("Error fetching accounts:", error);
        return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
    }
}