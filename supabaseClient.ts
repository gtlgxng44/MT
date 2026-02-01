
import { createClient } from "@supabase/supabase-js";

// Use process.env which is mapped in vite.config.ts to avoid "import.meta.env" undefined errors
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://fkdrsudcdosvwsosfemb.supabase.co";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrZHJzdWRjZG9zdndzb3NmZW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NTQwMDAsImV4cCI6MjA4NTMzMDAwMH0.G_A7Vw0tLKHAgJgjiISWWRCuozQIy_LZFIwS9gQIg7U";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
