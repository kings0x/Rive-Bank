import { Client, Account, Databases, Users } from "node-appwrite";
import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "my-custom-session";

/**
 * Creates a client authenticated with the user's session cookie.
 */
export async function createSessionClient() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

  if (!endpoint || !project) {
    throw new Error("Missing Appwrite configuration environment variables.");
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(project);

  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);

  if (!session || !session.value) {
    throw new Error("No active session found.");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    }
  };
}

/**
 * Creates a client with full admin/API key permissions.
 */
export async function createAdminClient() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const key = process.env.NEXT_APPWRITE_KEY;

  if (!endpoint || !project || !key) {
    throw new Error("Missing Appwrite admin configuration environment variables.");
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(project)
    .setKey(key);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get users() {
      return new Users(client);
    }
  };
}

/**
 * Helper to get a Databases instance directly (usually for admin tasks).
 */
export async function connectDatabase() {
  const { databases } = await createAdminClient();
  return databases;
}

/**
 * Safely retrieves the currently logged-in user.
 */
export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    return null;
  }
}