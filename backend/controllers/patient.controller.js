//controllers/patient.controller.js
import prisma from '../config/prismaClient.js';

// Get Medications with Adherence for a Patient
export const getMedications = async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.id },
      include: {
        medications: {
          include: {
            adherence: true,
          },
        },
      },
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient record not found' });
    }

    res.json({
      medications: patient.medications || [],
      caretakerId: patient.caretakerId || null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark Adherence as complete or missed
export const markAdherence = async (req, res) => {
  const { adherenceId, status } = req.body;

  try {
    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.id },
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient record not found' });
    }

    const adherence = await prisma.adherence.findUnique({
      where: { id: adherenceId },
    });

    if (!adherence || adherence.patientId !== patient.id) {
      return res.status(403).json({ message: 'Unauthorized or invalid adherence record' });
    }

    const updated = await prisma.adherence.update({
      where: { id: parseInt(adherenceId) },
      data: {
        status,
        timeTaken: status === 'complete' ? new Date() : null,
      },
    });


    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Assign a Caretaker to a Patient
export const assignCaretaker = async (req, res) => {
  const caretakerId = parseInt(req.body.caretakerId, 10);
  const userId = req.user.id;

  if (isNaN(caretakerId)) {
    return res.status(400).json({ message: 'Invalid caretaker ID' });
  }

  try {
    const caretaker = await prisma.caretaker.findUnique({
      where: { id: caretakerId },
    });

    if (!caretaker) {
      return res.status(404).json({ message: 'Caretaker not found' });
    }

    let patient = await prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      patient = await prisma.patient.create({
        data: { userId, caretakerId },
      });
    } else {
      patient = await prisma.patient.update({
        where: { userId },
        data: { caretakerId },
      });
    }

    res.json({ message: 'Caretaker assigned successfully', patient });
  } catch (err) {
    console.error('assignCaretaker error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Upload Adherence Proof Image
export const uploadAdherenceProof = async (req, res) => {
  const { adherenceId, status, photoUrl } = req.body;

  try {
    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.id },
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const adherence = await prisma.adherence.findUnique({
      where: { id: parseInt(adherenceId) },
    });

    if (!adherence || adherence.patientId !== patient.id) {
      return res.status(403).json({ message: 'Unauthorized or invalid adherence record' });
    }

    const updated = await prisma.adherence.update({
      where: { id: parseInt(adherenceId) },
      data: {
        status,
        timeTaken: status === 'complete' ? new Date() : null,
        photoUrl: photoUrl || null,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('Proof upload failed:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Get Adherence Analytics for Patient Dashboard
export const getAdherenceAnalytics = async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.id },
      include: {
        adherence: true,
      },
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const today = new Date();
    const adherence = patient.adherence;

    const thisMonth = today.getMonth();
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());

    let taken = 0,
      missed = 0,
      currentStreak = 0,
      takenThisWeek = 0;

    let sorted = [...adherence].sort((a, b) => new Date(b.date) - new Date(a.date));

    for (let record of sorted) {
      const recordDate = new Date(record.date);
      if (record.status === 'complete') taken++;
      if (record.status === 'missed') missed++;

      if (
        recordDate >= thisWeekStart &&
        recordDate <= today &&
        record.status === 'complete'
      ) {
        takenThisWeek++;
      }
    }

    for (let record of sorted) {
      const recordDate = new Date(record.date);
      if (recordDate > today) continue;
      if (record.status === 'complete') currentStreak++;
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
      monthlyProgress: {
        taken,
        missed,
        remaining,
        total,
      },
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ message: 'Failed to fetch adherence analytics' });
  }
};


// get own patient profile
export const getMyPatientProfile = async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.id },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    res.json({
      id: patient.id, // patientId
      user: patient.user
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch patient profile' });
  }
};
