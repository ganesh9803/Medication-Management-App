//controllers/caretaker.controller.js
import prisma from '../config/prismaClient.js';

export const getCaretakers = async (req, res) => {
  try {
    const caretakers = await prisma.caretaker.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    res.json(caretakers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPatients = async (req, res) => {
  try {
    const caretaker = await prisma.caretaker.findUnique({
      where: { userId: req.user.id },
      include: {
        patients: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            medications: {
              include: {
                adherence: true,
              },
            },
          },
        },
      },
    });

    // Format output to include patientId explicitly
    const formattedPatients = caretaker.patients.map((p) => ({
      patientId: p.id,  // 👈 expose the patient ID clearly
      userId: p.userId,
      caretakerId: p.caretakerId,
      user: p.user,
      medications: p.medications,
    }));

    res.json(formattedPatients);
  } catch (err) {
    console.error('getPatients error:', err);
    res.status(500).json({ message: err.message });
  }
};


export const assignMedication = async (req, res) => {
  const { patientId, name, dosage, frequency, durationDays } = req.body;

  try {

    const caretaker = await prisma.caretaker.findUnique({
      where: { userId: req.user.id }
    });
    if (!caretaker) {
      return res.status(403).json({ message: 'Caretaker record not found' });
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      select: { caretakerId: true },
    });

    if (!patient || patient.caretakerId !== caretaker.id) {
      return res.status(403).json({ message: 'Unauthorized or patient not found' });
    }


    const medication = await prisma.medication.create({
      data: { name, dosage, frequency, patientId, durationDays },
    });

    const today = new Date();
    const adherenceData = Array.from({ length: durationDays }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return {
        date,
        status: 'pending',
        medicationId: medication.id,
        patientId,
      };
    });

    await prisma.adherence.createMany({ data: adherenceData });
    res.status(201).json({ medication });
  } catch (err) {
    console.error('Assign medication error:', err);
    res.status(500).json({ message: err.message });
  }
};

export const updateMedication = async (req, res) => {
  const { medicationId, name, dosage, frequency, durationDays } = req.body;

  try {
    const caretaker = await prisma.caretaker.findUnique({
      where: { userId: req.user.id } // Get caretaker by logged-in user
    });

    const medication = await prisma.medication.findUnique({
      where: { id: medicationId },
      include: { patient: true },
    });

    if (!medication || medication.patient.caretakerId !== caretaker?.id) {
      return res.status(403).json({ message: 'Unauthorized or medication not found' });
    }

    const updated = await prisma.medication.update({
      where: { id: medicationId },
      data: { name, dosage, frequency, durationDays },
    });

    res.json({ ...updated, patientId: medication.patientId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const getAdherenceAnalytics = async (req, res) => {
  try {
    const patientId = req.user.role === 'PATIENT'
      ? (await prisma.patient.findUnique({ where: { userId: req.user.id } }))?.id
      : parseInt(req.query.patientId);

    if (!patientId) return res.status(400).json({ message: 'Invalid patient ID' });

    const adherence = await prisma.adherence.findMany({ where: { patientId } });

    const today = new Date();
    const thisMonth = today.getMonth();
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());

    let taken = 0, missed = 0, currentStreak = 0, takenThisWeek = 0;
    const sorted = [...adherence].sort((a, b) => new Date(b.date) - new Date(a.date));

    for (const r of sorted) {
      const d = new Date(r.date);
      if (r.status === 'complete') taken++;
      if (r.status === 'missed') missed++;
      if (r.status === 'complete' && d >= thisWeekStart && d <= today) takenThisWeek++;
    }

    for (const r of sorted) {
      if (new Date(r.date) > today) continue;
      if (r.status === 'complete') currentStreak++;
      else break;
    }

    const total = adherence.length;
    const remaining = total - taken - missed;
    const adherenceRate = total ? Math.round((taken / total) * 100) : 0;

    res.json({
      adherenceRate,
      currentStreak,
      takenThisWeek,
      missedThisMonth: adherence.filter(
        (r) => new Date(r.date).getMonth() === thisMonth && r.status === 'missed'
      ).length,
      monthlyProgress: { taken, missed, remaining, total },
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ message: 'Failed to fetch adherence analytics' });
  }
};

//get own profile
export const getMyCaretakerProfile = async (req, res) => {
  try {
    console.log('User ID from token:', req.user.id);
    const caretaker = await prisma.caretaker.findUnique({
      where: { userId: req.user.id },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!caretaker) {
      return res.status(404).json({ message: 'Caretaker profile not found' });
    }

    res.json({
      id: caretaker.id,
      user: caretaker.user
    });
  } catch (err) {
    console.error('getMyCaretakerProfile error:', err); // log the error
    res.status(500).json({ message: 'Failed to fetch caretaker profile' });
  }
};

// delete the medication
export const deleteMedication = async (req, res) => {
  const { medicationId } = req.params;

  try {
    // Get the caretaker record for the logged-in user
    const caretaker = await prisma.caretaker.findUnique({
      where: { userId: req.user.id },
    });

    if (!caretaker) {
      return res.status(403).json({ message: 'Caretaker not found' });
    }

    // Get the medication and patient info
    const medication = await prisma.medication.findUnique({
      where: { id: parseInt(medicationId) },
      include: { patient: true },
    });

    if (!medication || medication.patient.caretakerId !== caretaker.id) {
      return res.status(403).json({ message: 'Unauthorized or medication not found' });
    }

    // Delete adherence records first
    await prisma.adherence.deleteMany({
      where: { medicationId: medication.id },
    });

    // Delete the medication
    await prisma.medication.delete({
      where: { id: medication.id },
    });

    res.status(200).json({ medicationId: medication.id });
  } catch (err) {
    console.error('Delete medication error:', err);
    res.status(500).json({ message: 'Failed to delete medication' });
  }
};
