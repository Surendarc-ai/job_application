import { Router } from 'express';
import Customer from '../models/Customer.js';
import { authMiddleware } from '../middleware/auth.js';
import { parseCustomerPrompt } from '../utils/parseCustomerPrompt.js';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/ai-create', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || !String(prompt).trim()) {
      return res.status(400).json({ error: 'Please describe the customer you want to create' });
    }

    const parsed = parseCustomerPrompt(String(prompt));
    if (!parsed.firstName) {
      return res.status(400).json({
        error: 'Could not detect a customer name. Try: "John Doe" or "Create customer Raj Kumar from Chennai"',
      });
    }

    const customer = await Customer.create({
      ...parsed,
      userId: req.userId,
    });

    res.status(201).json({ customer, parsed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, gstNumber } = req.body;
    if (!firstName) {
      return res.status(400).json({ error: 'First name is required' });
    }
    const customer = await Customer.create({
      firstName,
      lastName: lastName || '',
      email: email || '',
      phone: phone || '',
      address: address || '',
      gstNumber: gstNumber || '',
      userId: req.userId,
    });
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, gstNumber } = req.body;
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        ...(firstName != null && { firstName }),
        ...(lastName != null && { lastName }),
        ...(email != null && { email }),
        ...(phone != null && { phone }),
        ...(address != null && { address }),
        ...(gstNumber != null && { gstNumber }),
      },
      { new: true }
    );
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
