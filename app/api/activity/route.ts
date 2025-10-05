
// app/api/public/activity/route.ts
import { NextResponse } from "next/server";

const FIRST = ["Maya","Arjun","Sara","Liam","Noah","Ava","Mila","Leo","Ivy","Owen","Chloe","Zoe","Nora","Ethan","Amara"];
const CITIES = ["Amsterdam","Berlin","Paris","Dublin","Lisbon","Warsaw","New York","LA","Mumbai","Bengaluru","Dubai","Singapore"];
const TITLES = ["Yoga Girl 1","Street Style","Beach Sunset","Gym Series","Indoor Shoots","Golden Hour"];

function rand<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)]; }
function nowMinus(maxMs: number) { return Date.now() - Math.floor(Math.random() * maxMs); }

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const packSlug = searchParams.get("slug") || undefined;

  // Create 6–10 recent events within last 10 minutes
  const n = 6 + Math.floor(Math.random() * 5);
  const recent = Array.from({ length: n }).map((_, i) => {
    const ts = nowMinus(10 * 60 * 1000); // last 10 min
    const title = packSlug ? rand(TITLES) : rand(TITLES);
    return {
      id: crypto.randomUUID(),
      name: rand(FIRST),
      city: rand(CITIES),
      pack_title: title,
      pack_slug: (title || "pack").toLowerCase().replace(/\s+/g, "-"),
      ts, // epoch ms
    };
  }).sort((a, b) => b.ts - a.ts);

  // For a **specific pack** show a "last hour" count
  const pack_hour_count = 10 + Math.floor(Math.random() * 40); // 10..49

  return NextResponse.json(
    { recent, pack_hour_count },
    { headers: { "Cache-Control": "no-store" } }
  );
}
