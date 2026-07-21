import type { Company, License, Payment } from "./types";

// Used only when DATABASE_URL isn't set yet (local preview before Neon is
// wired up via the Vercel integration -- see admin/README.md). Shape-only,
// not real customer data.
const now = Date.now();
const day = 24 * 60 * 60 * 1000;

export const fixtureCompanies: Company[] = [
  { id: "c1", name: "RunPod", contactEmail: "pardeep@runpod.io", contactName: "Pardeep Singh", category: "gpu_cloud", createdAt: new Date(now - 60 * day).toISOString() },
  { id: "c2", name: "Gnani.ai", contactEmail: "bharath.shankar@gnani.ai", contactName: "Bharath Shankar", category: "ai_product", createdAt: new Date(now - 40 * day).toISOString() },
  { id: "c3", name: "E2E Networks", contactEmail: "devendra.mishra@e2enetworks.com", contactName: "Devendra Mishra", category: "gpu_cloud", createdAt: new Date(now - 20 * day).toISOString() },
  { id: "c4", name: "Krutrim", contactEmail: null, contactName: null, category: "ai_product", createdAt: new Date(now - 5 * day).toISOString() },
];

export const fixtureLicenses: License[] = [
  { id: "l1", companyId: "c1", licenseId: "lic_runpod_001", licenseType: "paid", termYears: 1, issuedAt: new Date(now - 60 * day).toISOString(), expiresAt: new Date(now + 305 * day).toISOString(), gracePeriodDays: 15, topologyFingerprint: "fp_a1b2c3", revokedAt: null, issuedBy: "admin" },
  { id: "l2", companyId: "c2", licenseId: "lic_gnani_001", licenseType: "paid", termYears: 1, issuedAt: new Date(now - 40 * day).toISOString(), expiresAt: new Date(now - 3 * day).toISOString(), gracePeriodDays: 15, topologyFingerprint: "fp_d4e5f6", revokedAt: null, issuedBy: "admin" },
  { id: "l3", companyId: "c3", licenseId: "lic_e2e_001", licenseType: "paid", termYears: 1, issuedAt: new Date(now - 20 * day).toISOString(), expiresAt: new Date(now - 20 * day).toISOString(), gracePeriodDays: 15, topologyFingerprint: "fp_g7h8i9", revokedAt: null, issuedBy: "admin" },
  { id: "l4", companyId: "c4", licenseId: "lic_krutrim_trial", licenseType: "trial", termYears: null, issuedAt: new Date(now - 5 * day).toISOString(), expiresAt: new Date(now + 9 * day).toISOString(), gracePeriodDays: 15, topologyFingerprint: "fp_j1k2l3", revokedAt: null, issuedBy: "gateway-install" },
];

export const fixturePayments: Payment[] = [
  { id: "p1", companyId: "c1", provider: "razorpay", providerRef: "pay_R001", amount: 96000, currency: "INR", status: "succeeded", createdAt: new Date(now - 60 * day).toISOString() },
  { id: "p2", companyId: "c2", provider: "manual", providerRef: "invoice-2044", amount: 120000, currency: "INR", status: "succeeded", createdAt: new Date(now - 40 * day).toISOString() },
  { id: "p3", companyId: "c3", provider: "razorpay", providerRef: "pay_R002", amount: 84000, currency: "INR", status: "succeeded", createdAt: new Date(now - 20 * day).toISOString() },
];
