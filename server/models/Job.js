import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  officeBranch: { type: String, default: '' },
  description: { type: String, default: '' },
  paymentStatus: {
    type: String,
    enum: ['Non-Billed', 'Billed', 'Paid', 'Partial'],
    default: 'Non-Billed',
  },
  isDC: { type: Boolean, default: false },
  materialType: { type: String, default: '' },
  thickness: { type: Number, default: 0 },
  rateMode: {
    type: String,
    enum: ['runningMeterPiercing', 'ratePerPiece'],
    default: 'runningMeterPiercing',
  },
  runningMeter: { type: Number, default: 0 },
  piercingCount: { type: Number, default: 0 },
  ratePerPiece: { type: Number, default: 0 },
  quantity: { type: Number, default: 1 },
  addMaterialCost: { type: Boolean, default: false },
  materialThickness: { type: Number, default: 0 },
  materialLength: { type: Number, default: 0 },
  materialWidth: { type: Number, default: 0 },
  materialKg: { type: Number, default: 0 },
  materialRatePerKg: { type: Number, default: 0 },
  materialCost: { type: Number, default: 0 },
  addBending: { type: Boolean, default: false },
  bendingHours: { type: Number, default: 0 },
  bendingRatePerHour: { type: Number, default: 0 },
  bendingCost: { type: Number, default: 0 },
  runningMeterRate: { type: Number, default: 0 },
  piercingRate: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  deletedAt: { type: Date, default: null },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null },
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);
