"use client";

import { useEffect } from "react";
import { client } from "@/lib/appwrite";

export default function AppwritePing() {
    useEffect(() => {
        client
            .ping()
            .then(() => console.log("✅ Appwrite ping successful — backend is reachable."))
            .catch((err: unknown) => console.error("❌ Appwrite ping failed:", err));
    }, []);

    return null;
}
