// app/(auth)/legal/privacy/page.tsx
import { LegalPage } from "@/components/LegalPage"
import { readFile } from "fs/promises"
import path from "path"

export default async function PrivacyPage() {
  const filePath = path.join(process.cwd(), "public", "legal", "privacy.md")
  const md = await readFile(filePath, "utf8")
  return <LegalPage title="Privacy Policy" updated="Sep 2025" markdown={md} />
}