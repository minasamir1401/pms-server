const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const certificateId = "06015745";
  const qrCodeLabel = `2026-${certificateId}`;

  const cert = await prisma.certificate.upsert({
    where: { certificateId },
    update: {
      fullName: "آلاء صلاح ثابت علي",
      nationalId: "29910232500625",
      gender: "أنثى",
      nationality: "مصري",
      age: 26,
      phoneNumber: "01033902275",
      idAddress: "ابوتيج مركز ابوتيج اسيوط",
      maritalAddress: "ابو تيج",
      height: 165,
      weight: 65,
      bmi: 24,
      rh: "إيجابى",
      bloodType: "O",
      hb: 13.5,
      hbsAg: "غير متفاعل",
      antiHiv: "غير متفاعل",
      antiHcv: "غير متفاعل",
      bloodPressure: "80 / 120",
      randomBloodSugar: 103,
      hbA: 98.66,
      hbF: 0.0,
      hbA2: 1.34,
      hbC: 0.0,
      hbS: 0.0,
      unitName: "المطيعه",
      governorate: "محافظة أسيوط",
      issueDate: new Date("2026-04-01")
    },
    create: {
      certificateId,
      qrCodeLabel,
      issueDate: new Date("2026-04-01"),
      unitName: "المطيعه",
      governorate: "محافظة أسيوط",
      fullName: "آلاء صلاح ثابت علي",
      nationalId: "29910232500625",
      gender: "أنثى",
      nationality: "مصري",
      age: 26,
      phoneNumber: "01033902275",
      maritalAddress: "ابو تيج",
      idAddress: "ابوتيج مركز ابوتيج اسيوط",
      height: 165,
      weight: 65,
      bloodPressure: "80 / 120",
      bloodType: "O",
      rh: "إيجابى",
      hbsAg: "غير متفاعل",
      antiHcv: "غير متفاعل",
      antiHiv: "غير متفاعل",
      randomBloodSugar: 103,
      bmi: 24,
      hb: 13.5,
      hbA: 98.66,
      hbF: 0.0,
      hbA2: 1.34,
      hbC: 0.0,
      hbS: 0.0,
      partnerName: null,
      partnerNationalId: null
    }
  });

  console.log("Certificate created matching Image 1!");
  console.log("Certificate ID:", cert.certificateId);
  console.log("Full Name:", cert.fullName);
  console.log("Code Label:", cert.qrCodeLabel);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
