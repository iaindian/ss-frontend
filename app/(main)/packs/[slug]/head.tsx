// app/(main)/packs/[slug]/head.tsx
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type Pack = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  category?: string;
  price_cents: number;
  currency: string;
  preview_images?: string[];
  active?: boolean;
};

function absUrl(path: string) {
  try {
    return new URL(path, SITE_URL).toString();
  } catch {
    return path;
  }
}

async function getAllPacks(): Promise<Pack[]> {
  console.log("Api base is:", API_BASE);
  try {
    const res = await fetch(`${API_BASE}/packs`, { cache: "force-cache" });
    const data = await res.json(); // read once
    // console.log("res is", data);
    // console.log(res.ok, res.status);
    return data;
  } catch (err) {
    console.log(err);
    console.log("inside error");
    return [];
  }
}

async function getPack(slug: string): Promise<Pack | null> {
  const all = await getAllPacks();
  console.log("All is:", all)
  return all.items.find((p) => p.slug === slug || p.id === slug) || null;
}

export default async function Head({ params }: { params: { slug: string } }) {
  const pack = await getPack(params.slug);
  if (!pack) return null;

  const canonical = absUrl(`/packs/${pack.slug}`);
  const price = (pack.price_cents / 100).toFixed(2);
  const images = pack.preview_images?.length ? pack.preview_images : [];
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pack.title,
    description: pack.description || `AI image pack: ${pack.title}`,
    image: images,
    sku: pack.slug || pack.id,
    category: pack.category || "Creative",
    brand: { "@type": "Brand", name: "SuperSelfieAI" },
    offers: {
      "@type": "Offer",
      url: canonical,
      priceCurrency: pack.currency || "USD",
      price,
      availability:
        pack.active === false
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "SuperSelfieAI" },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absUrl("/") },
      { "@type": "ListItem", position: 2, name: "Packs", item: absUrl("/") },
      { "@type": "ListItem", position: 3, name: pack.title, item: canonical },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
