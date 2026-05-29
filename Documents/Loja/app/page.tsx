import { HomeExperience } from "@/components/home-experience";
import { getProducts } from "@/lib/catalog";
import { reviews } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getProducts();
  return <HomeExperience featured={products} reviews={reviews} />;
}
