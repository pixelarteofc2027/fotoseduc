import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = bcrypt.hashSync('changeme', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@fotoeduc.local' },
    update: { name: 'Admin FotoEduc', password: passwordHash, role: UserRole.SUPER_ADMIN },
    create: { email: 'admin@fotoeduc.local', name: 'Admin FotoEduc', password: passwordHash, role: UserRole.SUPER_ADMIN },
  });

  console.log('Seed: admin user upserted ->', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
