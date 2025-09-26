// app/(auth)/legal/terms/page.tsx
import { LegalPage } from "@/components/LegalPage"
import { readFile } from "fs/promises"
import path from "path"

export default async function TermsPage() {
  const filePath = path.join(process.cwd(), "public", "legal", "terms.md")
  const md = await readFile(filePath, "utf8")
  return <LegalPage title="Terms & Conditions" updated="Sep 2025" markdown={md} />
}