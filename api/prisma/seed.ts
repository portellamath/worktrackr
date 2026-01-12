import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  const company = await prisma.company.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, name: "WorkTrackr" },
  });

  await prisma.user.upsert({
    where: { email: "admin@worktrackr.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@worktrackr.com",
      password: passwordHash,
      role: "ADMIN",
      companyId: company.id,
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());