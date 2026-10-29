"use client";

import { useEffect } from "react";
import { startSync } from "@/lib/sync";

// Mounted once in the root layout. Does nothing in demo mode.
export default function CloudBridge() {
  useEffect(() => startSync(), []);
  return null;
}
