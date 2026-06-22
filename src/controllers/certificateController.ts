import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// Helper to generate a random 8-digit numeric string
function generate8DigitId(): string {
  const random5Digits = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `050${random5Digits}`;
}

/**
 * Get all certificates, sorted descending by creation date.
 */
export async function getAllCertificates(req: Request, res: Response) {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: {
        issueDate: "desc",
      },
    });
    return res.json(certificates);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return res.status(500).json({ error: "حدث خطأ أثناء جلب الشهادات" });
  }
}

/**
 * Get a single certificate by its unique 8-digit ID.
 */
export async function getCertificate(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const certificate = await prisma.certificate.findUnique({
      where: { certificateId: id },
    });

    if (!certificate) {
      return res.status(404).json({ error: "الشهادة الطبية غير موجودة" });
    }

    return res.json(certificate);
  } catch (error) {
    console.error("Error fetching certificate:", error);
    return res.status(500).json({ error: "حدث خطأ أثناء جلب تفاصيل الشهادة" });
  }
}

/**
 * Create a new premarital certificate, generating a verified unique 8-digit ID.
 */
export async function createCertificate(req: Request, res: Response) {
  try {
    const body = req.body;

    let certificateId = "";
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      certificateId = generate8DigitId();
      const existing = await prisma.certificate.findUnique({
        where: { certificateId },
      });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({ error: "فشل في توليد رقم شهادة فريد، يرجى المحاولة مرة أخرى" });
    }

    const qrCodeLabel = `2026-${certificateId}`;

    const newCertificate = await prisma.certificate.create({
      data: {
        certificateId,
        qrCodeLabel,
        issueDate: body.issueDate ? new Date(body.issueDate) : undefined,
        unitName: body.unitName,
        governorate: body.governorate,
        fullName: body.fullName,
        nationalId: body.nationalId,
        gender: body.gender,
        nationality: body.nationality,
        age: parseInt(body.age, 10),
        phoneNumber: body.phoneNumber,
        maritalAddress: body.maritalAddress || null,
        idAddress: body.idAddress,
        height: parseFloat(body.height),
        weight: parseFloat(body.weight),
        bloodPressure: body.bloodPressure,
        bloodType: body.bloodType,
        rh: body.rh,
        hbsAg: body.hbsAg,
        antiHcv: body.antiHcv,
        antiHiv: body.antiHiv,
        randomBloodSugar: parseFloat(body.randomBloodSugar),
        bmi: parseFloat(body.bmi) || 0,
        hb: parseFloat(body.hb),
        hbA: parseFloat(body.hbA) || 0,
        hbF: parseFloat(body.hbF) || 0,
        hbA2: parseFloat(body.hbA2) || 0,
        hbC: parseFloat(body.hbC) || 0,
        hbS: parseFloat(body.hbS) || 0,
        partnerName: body.partnerName || null,
        partnerNationalId: body.partnerNationalId || null,
      },
    });

    return res.json({ success: true, certificate: newCertificate });
  } catch (error) {
    console.error("Error creating certificate:", error);
    return res.status(500).json({ error: "حدث خطأ أثناء حفظ الشهادة الطبية في قاعدة البيانات" });
  }
}

/**
 * Update an existing premarital certificate by ID.
 */
export async function updateCertificate(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const body = req.body;

    const updatedCertificate = await prisma.certificate.update({
      where: { certificateId: id },
      data: {
        issueDate: body.issueDate ? new Date(body.issueDate) : undefined,
        unitName: body.unitName,
        governorate: body.governorate,
        fullName: body.fullName,
        nationalId: body.nationalId,
        gender: body.gender,
        nationality: body.nationality,
        age: parseInt(body.age, 10),
        phoneNumber: body.phoneNumber,
        maritalAddress: body.maritalAddress || null,
        idAddress: body.idAddress,
        height: parseFloat(body.height),
        weight: parseFloat(body.weight),
        bloodPressure: body.bloodPressure,
        bloodType: body.bloodType,
        rh: body.rh,
        hbsAg: body.hbsAg,
        antiHcv: body.antiHcv,
        antiHiv: body.antiHiv,
        randomBloodSugar: parseFloat(body.randomBloodSugar),
        bmi: parseFloat(body.bmi) || 0,
        hb: parseFloat(body.hb),
        hbA: parseFloat(body.hbA) || 0,
        hbF: parseFloat(body.hbF) || 0,
        hbA2: parseFloat(body.hbA2) || 0,
        hbC: parseFloat(body.hbC) || 0,
        hbS: parseFloat(body.hbS) || 0,
        partnerName: body.partnerName || null,
        partnerNationalId: body.partnerNationalId || null,
      },
    });

    return res.json({ success: true, certificate: updatedCertificate });
  } catch (error) {
    console.error("Error updating certificate:", error);
    return res.status(500).json({ error: "حدث خطأ أثناء تحديث الشهادة الطبية" });
  }
}

/**
 * Delete a premarital certificate by ID.
 */
export async function deleteCertificate(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.certificate.delete({
      where: { certificateId: id },
    });
    return res.json({ success: true, message: "تم حذف الشهادة الطبية بنجاح" });
  } catch (error) {
    console.error("Error deleting certificate:", error);
    return res.status(500).json({ error: "حدث خطأ أثناء حذف الشهادة الطبية" });
  }
}
