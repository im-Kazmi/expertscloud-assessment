import { hc } from "hono/client";
import type { AppType } from ".";

const isProduction = process.env.NODE_ENV === "production";
const apiUrl = isProduction
  ? process.env.NEXT_PUBLIC_API_URL ||
    "https://expertscloud-assessment.vercel.app/"
  : "http://localhost:3000/";

export const client = hc<AppType>(apiUrl);
