import mongoose from 'mongoose';
import { ROLE } from '../constants/roles.js';

// company_id is stored in JWT on login and read by auth middleware as req.companyId

function toObjectId(id) {
  if (!id) return id;
  return mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id;
}

export function getScopeFilter(req) {
  if (req.companyId) {
    return { company_id: toObjectId(req.companyId) };
  }
  if (req.userRole === ROLE.SUPER_ADMIN) {
    return {};
  }
  return { userId: toObjectId(req.userId) };
}

export function getCompanyIdForSave(req) {
  return req.companyId || null;
}
