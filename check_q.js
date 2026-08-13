const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkQuestionMarks() {
  const certs = await prisma.certificate.findMany();
  let count = 0;
  for (const cert of certs) {
    let hasQ = false;
    for (const [key, value] of Object.entries(cert)) {
      if (typeof value === 'string' && value.includes('?')) {
        hasQ = true;
        // console.log(`Found ? in ${key}: ${value}`);
      }
    }
    if (hasQ) count++;
  }
  console.log(`Found ${count} certificates with question marks.`);
}

checkQuestionMarks().catch(console.error).finally(() => prisma.$disconnect());
