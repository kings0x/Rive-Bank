import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Use a per-request AbortController (avoid reusing the same top-level controller) */
async function load(data: any): Promise<Account[] | null> {
  const controller = new AbortController();
  try {
    const res = await fetch(`http://localhost:3000/api/accounts/${data}`, {
      signal: controller.signal,
      credentials: "include", // include cookies if your login uses session cookie
    });

    if (!res.ok) {
      console.error("Fetch failed:", res.status, res.statusText);
      return null; // return null on non-OK
    }

    const json = await res.json();
    console.log("raw fetch response:", json);

    // normalize to an array safely:
    let items: any[] = [];
    if (Array.isArray(json?.data)) items = json.data;
    else if (json?.data && typeof json.data === "object") items = [json.data];
    else if (Array.isArray(json)) items = json;

    // map safely to Account[]
    const mapped: Account[] = items.map((item: any) => ({
      id: item.$id ?? item.id ?? Math.random().toString(36).slice(2),
      name: item.name ?? "Unknown Account",
      type: String(item.type ?? "Unknown"),
      balance: Number(item.balance ?? 0),
      // guard against undefined, use String(...) instead of .toString() directly
      accountNumber: String(item.account_number ?? item.accountNumber ?? ""),
      full_user_name: item.full_user_name
    }));

    console.log("mapped accounts:", mapped);
    return mapped;
  } catch (err: any) {
    if (err?.name === "AbortError") {
      console.log("fetch aborted");
      return null;
    } else {
      console.error("fetch error:", err);
      return null;
    }
  }
}

type Account = {
  id: string;
  name: string;
  type: string;
  balance: number;
  accountNumber: string;
};

type UserAccountState = {
  accountDetails: Account[]; // typed as Account[]
  fetchAccountDetails: (data: string) => Promise<Account[] | null>;
};

type AccountIdState = {
  currentAccountId: string
  setCurrentAccountId: (id: string) => void
}

type UserIdState = {
  userId: string
  setUserId: (id: string) => void
}

export const useAccountStore = create<UserAccountState>()(
  // remove persist if you don't want localStorage; kept minimal here
  (set) => ({
    accountDetails: [],
    fetchAccountDetails: async (data: string) => {
      const accounts = await load(data);        // Account[] | null
      set({ accountDetails: accounts ?? [] }); // update store with array (never undefined)
      return accounts;                         // IMPORTANT: return the fetched accounts
    },
  })
);

export const useCurrentAccountIdStore = create<AccountIdState>()(
  (set)=>({
    currentAccountId: "",
    setCurrentAccountId: (id: string) => set({currentAccountId: id})
  })
)

export const useUserIdStore = create<UserIdState>()(
  (set)=>({
    userId: "",
    setUserId: (id: string) => set({userId: id})
  })
)