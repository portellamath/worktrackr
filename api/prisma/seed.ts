import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // COMPANY
  const company = await prisma.company.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "WorkTrackr"
    }
  });

  // USER ADMIN
  await prisma.user.upsert({
    where: { email: "admin@worktrackr.com" },
    update: {},
    create: {
      email: "admin@worktrackr.com",
      password: "hashed-password-fake",
      role: "ADMIN",
      companyId: company.id
    }
  });

  console.log(" Seed executado com sucesso");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
