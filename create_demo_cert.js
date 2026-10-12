const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const certificateId = "06078942";
  const qrCodeLabel = `2026-${certificateId}`;

  const cert = await prisma.certificate.upsert({
    where: { certificateId },
    update: {
      fullName: "أحمد محمد محمود حسن",
      nationalId: "29801010101234",
      governorate: "القاهرة",
      unitName: "مركز رعاية طفل مصر الجديدة",
      partnerName: "سارة علي إبراهيم خليل",
      partnerNationalId: "29905050105678"
    },
    create: {
      certificateId,
      qrCodeLabel,
      issueDate: new Date(),
      unitName: "مركز رعاية طفل مصر الجديدة",
      governorate: "القاهرة",
      fullName: "أحمد محمد محمود حسن",
      nationalId: "29801010101234",
      gender: "ذكر",
      nationality: "مصري",
      age: 28,
      phoneNumber: "01012345678",
      maritalAddress: "15 شارع الثورة - مصر الجديدة - القاهرة",
      idAddress: "15 شارع الثورة - مصر الجديدة - القاهرة",
      height: 178,
      weight: 76,
      bloodPressure: "120/80",
      bloodType: "O",
      rh: "+",
      hbsAg: "سلبي",
      antiHcv: "سلبي",
      antiHiv: "سلبي",
      randomBloodSugar: 95,
      bmi: 24.0,
      hb: 14.5,
      hbA: 97.2,
      hbF: 0.6,
      hbA2: 2.2,
      hbC: 0.0,
      hbS: 0.0,
      partnerName: "سارة علي إبراهيم خليل",
      partnerNationalId: "29905050105678"
    }
  });

  await prisma.admin.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      username: "admin",
      password: "password123"
    }
  });

  console.log("Certificate created successfully!");
  console.log("Certificate ID:", cert.certificateId);
  console.log("Full Name:", cert.fullName);
  console.log("National ID:", cert.nationalId);
  console.log("QR Code Label:", cert.qrCodeLabel);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
