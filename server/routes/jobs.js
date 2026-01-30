import Job from '../models/Job.js';

app.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.userId }).sort({ date: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/jobs', async (req, res) => {
  try {
    const { name, description, date } = req.body;
    if (!name || !date) {
      return res.status(400).json({ error: 'Job name and date required' });
    }
    const job = await Job.create({
      name,
      description: description || '',
      date: new Date(date),
      userId: req.userId,
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/:id', async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, userId: req.userId });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/:id', async (req, res) => {
  try {
    const { name, description, date } = req.body;
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ...(name != null && { name }), ...(description != null && { description }), ...(date != null && { date: new Date(date) }) },
      { new: true }
    );
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
