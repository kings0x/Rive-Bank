'use server'

import { createAdminClient } from "../appwrite";
import { cookies } from "next/headers";
// const performLogin = async (formData: LoginProps) => {
//     const response =await fetch("/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//         credentials: "include"
//     })

//     return response
// }

export async function performLogin(formData: LoginProps) {
    try{

        const { email, password } = formData
        const { account } = await createAdminClient();

        const session = await account.createEmailPasswordSession(email, password);

        const cookieStore = await cookies();
        cookieStore.set("my-custom-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return session;
    }

    catch(error: any){
        console.log(error)
    }
    
}