import XLSX from 'xlsx';
import Job from '../models/Job.js';
import Customer from '../models/Customer.js';
import Item from '../models/Item.js';
import User from '../models/User.js';
import Company from '../models/Company.js';
import Role from '../models/Role.js';
import { saveExportFile } from './saveExport.js';

function formatDisplayDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  const day = String(dt.getDate()).padStart(2, '0');
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const year = dt.getFullYear();
  return `${day}/${month}/${year}`;
}

function customerName(c) {
  if (!c || typeof c !== 'object') return '';
  return `${c.firstName || ''} ${c.lastName || ''}`.trim();
}

function exportFilename() {
  const tz = process.env.EXPORT_CRON_TZ || 'Asia/Kolkata';
  const date = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  return `job-app-export_${date}.xlsx`;
}

function sheetFromRows(name, headers, rows) {
  const sheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  sheet['!cols'] = headers.map((h) => ({ wch: Math.min(40, Math.max(10, String(h).length + 2)) }));
  return { name, sheet };
}

async function fetchAllData() {
  const [jobs, customers, items, users, companies, roles] = await Promise.all([
    Job.find().populate('customer', 'firstName lastName').sort({ date: -1 }).lean(),
    Customer.find().sort({ createdAt: -1 }).lean(),
    Item.find().sort({ material: 1, thickness: 1 }).lean(),
    User.find().populate('role_id', 'name').populate('company_id', 'name').select('-password').lean(),
    Company.find().sort({ name: 1 }).lean(),
    Role.find().sort({ name: 1 }).lean(),
  ]);
  return { jobs, customers, items, users, companies, roles };
}

export function buildExportWorkbook(data) {
  const workbook = XLSX.utils.book_new();

  const jobsSheet = sheetFromRows('Jobs', [
    'Customer', 'Date', 'Office / Branch', 'DC', 'Material', 'Qty', 'Thickness (mm)',
    'Status', 'Description', 'Total', 'Rate Mode', 'Running Meter', 'Piercing Count',
    'Rate Per Piece', 'Material Kg', 'Material Rate/Kg', 'Running Meter Rate', 'Piercing Rate',
  ], data.jobs.map((job) => [
    customerName(job.customer),
    formatDisplayDate(job.date),
    job.officeBranch || '',
    job.isDC ? 'Yes' : 'No',
    job.materialType || '',
    job.quantity ?? '',
    job.thickness ?? '',
    job.paymentStatus || '',
    job.description || '',
    job.totalAmount ?? 0,
    job.rateMode || '',
    job.runningMeter ?? 0,
    job.piercingCount ?? 0,
    job.ratePerPiece ?? 0,
    job.materialKg ?? 0,
    job.materialRatePerKg ?? 0,
    job.runningMeterRate ?? 0,
    job.piercingRate ?? 0,
  ]));
  XLSX.utils.book_append_sheet(workbook, jobsSheet.sheet, jobsSheet.name);

  const customersSheet = sheetFromRows('Customers', [
    'First Name', 'Last Name', 'Email', 'Phone', 'Address', 'GST Number', 'Created',
  ], data.customers.map((c) => [
    c.firstName || '',
    c.lastName || '',
    c.email || '',
    c.phone || '',
    c.address || '',
    c.gstNumber || '',
    formatDisplayDate(c.createdAt),
  ]));
  XLSX.utils.book_append_sheet(workbook, customersSheet.sheet, customersSheet.name);

  const itemsSheet = sheetFromRows('Items', [
    'Material', 'Thickness (mm)', 'Running Meter Rate', 'Piercing Rate', 'Created',
  ], data.items.map((i) => [
    i.material || '',
    i.thickness ?? '',
    i.runningMeterRate ?? 0,
    i.piercingRate ?? 0,
    formatDisplayDate(i.createdAt),
  ]));
  XLSX.utils.book_append_sheet(workbook, itemsSheet.sheet, itemsSheet.name);

  const usersSheet = sheetFromRows('Users', [
    'Username', 'Role', 'Company', 'Created',
  ], data.users.map((u) => [
    u.username || '',
    u.role_id?.name || '',
    u.company_id?.name || '',
    formatDisplayDate(u.createdAt),
  ]));
  XLSX.utils.book_append_sheet(workbook, usersSheet.sheet, usersSheet.name);

  const companiesSheet = sheetFromRows('Companies', [
    'Name', 'Created',
  ], data.companies.map((c) => [
    c.name || '',
    formatDisplayDate(c.createdAt),
  ]));
  XLSX.utils.book_append_sheet(workbook, companiesSheet.sheet, companiesSheet.name);

  const rolesSheet = sheetFromRows('Roles', [
    'Name', 'Created',
  ], data.roles.map((r) => [
    r.name || '',
    formatDisplayDate(r.createdAt),
  ]));
  XLSX.utils.book_append_sheet(workbook, rolesSheet.sheet, rolesSheet.name);

  return workbook;
}

export async function runScheduledExport() {
  const data = await fetchAllData();
  const workbook = buildExportWorkbook(data);
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  const filename = exportFilename();
  const location = await saveExportFile(buffer, filename);

  return {
    filename,
    location,
    exportedAt: new Date().toISOString(),
    counts: {
      jobs: data.jobs.length,
      customers: data.customers.length,
      items: data.items.length,
      users: data.users.length,
      companies: data.companies.length,
      roles: data.roles.length,
    },
  };
}
