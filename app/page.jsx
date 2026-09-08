import Link from "next/link";
import { prisma } from "@/lib/db";
import { toPlain } from "@/lib/utils";
import { productListInclude } from "@/lib/product";
import ProductCard from "@/components/products/ProductCard";
import Button from "@/components/common/Button";
import HeroScene from "@/components/home/HeroScene";
import TiltCard from "@/components/home/TiltCard";
import SectionTilt from "@/components/home/SectionTilt";
import HomeCategoryWall from "@/components/home/HomeCategoryWall";
import HomeStandard from "@/components/home/HomeStandard";
import HomeCodScene from "@/components/home/HomeCodScene";
import HomeFieldNotes from "@/components/home/HomeFieldNotes";

export const dynamic = "force-dynamic";

async function getHomeData() {
  const [featuredProducts, categories, blogs] = await Promise.all([
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: productListInclude,
    }),
    prisma.category.findMany({
      where: { status: "ACTIVE" },
      take: 5,
      include: { _count: { select: { products: true } } },
    }),
    prisma.blog.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
  ]);

  return {
    featuredProducts: toPlain(featuredProducts),
    categories: toPlain(categories),
    blogs: toPlain(blogs),
  };
}

export default async function HomePage() {
  const { featuredProducts, categories, blogs } = await getHomeData();

  return (
    <div className="home-studio">
      <HeroScene />

      <HomeStandard />

      <section className="home-band home-band-deep">
        <div className="container-app relative py-16 sm:py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="home-kicker">Showroom</p>
              <h2 className="home-heading">Shop the kit</h2>
              <p className="text-slate-400 mt-2">Five boards. One tap to the accessory you need.</p>
            </div>
            <Link href="/categories" className="hidden sm:inline-flex text-brand-300 font-semibold hover:text-white">
              View all →
            </Link>
          </div>
          <HomeCategoryWall categories={categories} />
        </div>
      </section>

      <section className="home-band">
        <div className="container-app relative py-16 sm:py-20">
          <SectionTilt intensity={5}>
            <div className="cod-banner">
              <div className="cod-copy">
                <p className="home-kicker">Nationwide</p>
                <h2 className="home-heading mb-3">Cash on Delivery</h2>
                <p className="text-slate-300 max-w-md mb-6">
                  No online payment. Order the accessory, keep cash ready, pay when the box lands.
                </p>
                <Button as={Link} href="/products" size="lg" className="shadow-[0_18px_40px_rgba(6,182,212,0.45)]">
                  Start Shopping →
                </Button>
              </div>
              <HomeCodScene />
            </div>
          </SectionTilt>
        </div>
      </section>

      <section className="home-band home-band-deep">
        <div className="container-app relative py-16 sm:py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="home-kicker">On the shelf</p>
              <h2 className="home-heading">Featured accessories</h2>
              <p className="text-slate-400 mt-2">Lift each piece off the floor — then add it to cart.</p>
            </div>
            <Link href="/products" className="hidden sm:inline-flex text-brand-300 font-semibold hover:text-white">
              View all →
            </Link>
          </div>
          <div className="product-stage">
            {featuredProducts.map((product) => (
              <div key={product.id} className="product-pod">
                <span className="product-pod-glow" />
                <TiltCard intensity={12}>
                  <ProductCard product={product} />
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {blogs.length > 0 && (
        <section className="home-band notes-band">
          <div className="container-app relative py-16 sm:py-20">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="home-kicker">Field notes</p>
                <h2 className="home-heading">Guides in depth</h2>
                <p className="text-slate-400 mt-2">Charge smarter. Connect cleaner.</p>
              </div>
              <Link href="/blogs" className="hidden sm:inline-flex text-brand-300 font-semibold hover:text-white">
                View all →
              </Link>
            </div>
            <HomeFieldNotes blogs={blogs} />
          </div>
        </section>
      )}

      <section className="home-band home-band-deep pb-24">
        <div className="container-app relative py-8">
          <div className="cta-orbit">
            <div className="cta-orbit-ring cta-orbit-a" />
            <div className="cta-orbit-ring cta-orbit-b" />
            <div className="relative text-center px-6 py-16 sm:py-20">
              <p className="home-kicker justify-center">Last 1%</p>
              <h2 className="home-heading hero-3d-title mb-4">Ready when your battery isn&apos;t.</h2>
              <p className="text-slate-300 max-w-xl mx-auto mb-8">
                Browse cables, adapters, earbuds and handsfree — no signup, Cash on Delivery.
              </p>
              <Button as={Link} href="/products" size="lg" className="shadow-[0_18px_40px_rgba(6,182,212,0.45)]">
                Explore All Products
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
