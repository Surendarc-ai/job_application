import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Role from '../models/Role.js';
import { ROLE } from '../constants/roles.js';
import { userPayload, resolveRoleName } from '../utils/userPayload.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

const userPopulate = [
  { path: 'role_id', select: 'name' },
  { path: 'company_id', select: 'name' },
];

function signToken(user) {
  const role = resolveRoleName(user);
  return jwt.sign(
    {
      userId: user._id,
      role,
      roleId: user.role_id?._id,
      companyId: user.company_id?._id ? String(user.company_id._id) : null,
    },
    JWT_SECRET,
    { expiresIn: '7d' },
  );
}

router.get('/login', (_, res) => {
  res.json({ message: 'Use POST with JSON body: { username, password }' });
});

router.get('/register', (_, res) => {
  res.json({ message: 'Use POST with JSON body: { username, password }' });
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    const user = await User.findOne({ username }).populate(userPopulate);
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const token = signToken(user);
    res.json({ token, user: userPayload(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    if (await User.findOne({ username })) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const isFirstUser = (await User.countDocuments()) === 0;
    const roleName = isFirstUser ? ROLE.SUPER_ADMIN : ROLE.MEMBER;
    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return res.status(500).json({ error: 'Roles not initialized' });
    }

    const user = await User.create({
      username,
      password,
      role_id: role._id,
    });
    await user.populate(userPopulate);

    const token = signToken(user);
    res.status(201).json({ token, user: userPayload(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
