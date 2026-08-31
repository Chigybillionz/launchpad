/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@launchpad.com';
  const password = 'password123';
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'ADMIN',
      passwordHash
    },
    create: {
      name: 'System Admin',
      email,
      role: 'ADMIN',
      passwordHash,
      experienceLevel: 'ADVANCED',
      location: 'Remote',
      skills: ['Leadership', 'Management'],
      interests: ['Technology'],
      goals: ['Growth'],
      workPreferences: ['Remote'],
      profileCompleted: true
    }
  });

  console.log(`Admin user ready: ${admin.email} (Password: ${password})`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
