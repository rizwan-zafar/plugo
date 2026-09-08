import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { categories as catalogCategories, products as catalogProducts } from "./catalog.js";

const prisma = new PrismaClient();

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const adminEmail = process.env.ADMIN_SEED_EMAIL || "admin@plugo.com";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || "Admin@123";

  const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await prisma.admin.create({
      data: { name: "Plugo Admin", email: adminEmail, password: hashed },
    });
    console.log(`Admin created -> email: ${adminEmail} / password: ${adminPassword}`);
  } else {
    console.log("Admin already exists, skipping.");
  }

  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.blog.deleteMany();

  const categories = {};
  for (const cat of catalogCategories) {
    const slug = slugify(cat.name);
    const category = await prisma.category.create({
      data: { ...cat, slug, status: "ACTIVE" },
    });
    categories[cat.name] = category;
  }
  console.log(`Seeded ${catalogCategories.length} categories.`);

  for (const p of catalogProducts) {
    const slug = slugify(p.name);
    const variants = p.variants.map((variant) => ({
      name: variant.name,
      price: variant.price,
      compareAtPrice: variant.compareAtPrice || null,
      stock: variant.stock,
    }));
    const totalStock = variants.reduce((sum, variant) => sum + variant.stock, 0);
    const minPrice = Math.min(...variants.map((variant) => variant.price));
    await prisma.product.create({
      data: {
        name: p.name,
        slug,
        description: p.description,
        price: minPrice,
        stock: totalStock,
        images: p.images || [],
        status: "ACTIVE",
        categoryId: categories[p.category].id,
        variants: { create: variants },
      },
    });
  }
  console.log(`Seeded ${catalogProducts.length} products.`);

  const blogsData = [
    {
      title: "USB-C vs Lightning: Which Cable Should You Buy?",
      author: "Plugo Team",
      content:
        "Most new Android phones and many accessories now use USB-C. iPhone models still split between Lightning and USB-C depending on the year. If your phone has a USB-C port, buy a USB-C to USB-C cable for the fastest charge. If it still uses Lightning, a dedicated Lightning cable is more reliable than a cheap 3-in-1. Keep one 3-in-1 in the bag for guests and older devices — and use a matched cable at the desk.",
      featuredImage: "/images/blog/usbc-vs-lightning.jpg",
    },
    {
      title: "How Many Watts Do You Actually Need?",
      author: "Plugo Team",
      content:
        "A 20W PD adapter is enough for most phones and will charge faster than old 5W bricks. 65W GaN makes sense if you also charge a tablet or a light laptop from the same plug. Car chargers should have two ports if two people ride together. More watts will not harm a phone that negotiates Power Delivery — the device only draws what it needs. Match the cable too: a thin no-name cable can bottleneck a good adapter.",
      featuredImage: "/images/blog/charger-watts.jpg",
    },
    {
      title: "Keep Earbuds Alive Longer",
      author: "Plugo Team",
      content:
        "Wireless earbuds last longer when you avoid draining them to zero every day. Drop them in the case between uses, wipe the charging contacts, and don't leave the open case in a hot car. Wired handsfree still wins for calls at a desk and for phones with a headphone jack or USB-C audio. Choose wireless for commutes; keep a wired pair as backup when the case is empty.",
      featuredImage: "/images/blog/earbuds-care.jpg",
    },
  ];

  for (const b of blogsData) {
    const slug = slugify(b.title);
    await prisma.blog.create({
      data: {
        title: b.title,
        slug,
        author: b.author,
        content: b.content,
        featuredImage: b.featuredImage,
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
  }
  console.log(`Seeded ${blogsData.length} blog posts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
