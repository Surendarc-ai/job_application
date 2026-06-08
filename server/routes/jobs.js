import { Router } from 'express';
import Job from '../models/Job.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.userId })
      .populate('customer', 'firstName lastName')
      .sort({ date: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      date, customer, officeBranch, description, paymentStatus, isDC,
      materialType, thickness, rateMode,
      runningMeter, piercingCount, ratePerPiece, quantity,
      addMaterialCost, materialKg, materialRatePerKg,
      runningMeterRate, piercingRate, totalAmount,
    } = req.body;

    if ((!date || !customer) && !isDC) {
      return res.status(400).json({ error: 'Date and customer are required' });
    }
    if (!isDC && (!materialType || thickness === null || thickness === undefined || thickness === '')) {
      return res.status(400).json({ error: 'Material type and thickness are required' });
    }

    const job = await Job.create({
      date: new Date(date),
      customer,
      officeBranch: officeBranch || '',
      description: description || '',
      paymentStatus: paymentStatus || 'Non-Billed',
      isDC: !!isDC,
      materialType: materialType || '',
      thickness: thickness != null && thickness !== '' ? Number(thickness) : 0,
      rateMode: rateMode || 'runningMeterPiercing',
      runningMeter: Number(runningMeter) || 0,
      piercingCount: Number(piercingCount) || 0,
      ratePerPiece: Number(ratePerPiece) || 0,
      quantity: Number(quantity) || 1,
      addMaterialCost: !!addMaterialCost,
      materialKg: Number(materialKg) || 0,
      materialRatePerKg: Number(materialRatePerKg) || 0,
      runningMeterRate: Number(runningMeterRate) || 0,
      piercingRate: Number(piercingRate) || 0,
      totalAmount: Number(totalAmount) || 0,
      userId: req.userId,
    });

    const populated = await Job.findById(job._id).populate('customer', 'firstName lastName');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, userId: req.userId })
      .populate('customer', 'firstName lastName');
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updates = {};
    const fields = [
      'date', 'customer', 'officeBranch', 'description', 'paymentStatus', 'isDC',
      'materialType', 'thickness', 'rateMode',
      'runningMeter', 'piercingCount', 'ratePerPiece', 'quantity',
      'addMaterialCost', 'materialKg', 'materialRatePerKg',
      'runningMeterRate', 'piercingRate', 'totalAmount',
    ];
    for (const f of fields) {
      if (req.body[f] != null) {
        if (f === 'date') updates[f] = new Date(req.body[f]);
        else updates[f] = req.body[f];
      }
    }

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updates,
      { new: true }
    ).populate('customer', 'firstName lastName');

    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
