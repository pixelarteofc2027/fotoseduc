import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = bcrypt.hashSync("changeme", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@fotoeduc.local" },
    update: {
      name: "Admin FotoEduc",
      password: passwordHash,
      role: UserRole.ADMIN
    },
    create: {
      email: "admin@fotoeduc.local",
      name: "Admin FotoEduc",
      password: passwordHash,
      role: UserRole.ADMIN
    }
  });

  console.log("Seed: admin user upserted ->", admin.email);

  // Create a sample photographer user
  const photographerUser = await prisma.user.upsert({
    where: { email: "photographer@fotoeduc.local" },
    update: {},
    create: {
      email: "photographer@fotoeduc.local",
      name: "Fotógrafo Exemplo",
      password: passwordHash,
      role: UserRole.PHOTOGRAPHER
    }
  });

  const photographer = await prisma.photographer.upsert({
    where: { userId: photographerUser.id },
    update: {},
    create: {
      userId: photographerUser.id,
      slug: "fotografo-exemplo",
      bio: "Fotógrafo exemplo criado pelo seed script"
    }
  });

  console.log("Seed: photographer created ->", photographer.slug);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
