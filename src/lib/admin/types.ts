export type LicenseType = "trial" | "paid";
export type PaymentProvider = "razorpay" | "skydo" | "manual";
export type PaymentStatus = "pending" | "succeeded" | "failed";
export type CompanyCategory = "gpu_cloud" | "ai_product";

export interface Company {
  id: string;
  name: string;
  contactEmail: string | null;
  contactName: string | null;
  category: CompanyCategory;
  createdAt: string;
}

export interface License {
  id: string;
  companyId: string;
  licenseId: string;
  licenseType: LicenseType;
  termYears: number | null;
  issuedAt: string;
  expiresAt: string;
  gracePeriodDays: number;
  topologyFingerprint: string;
  revokedAt: string | null;
  issuedBy: string;
}

export interface PaymentLink {
  id: string;
  companyId: string;
  amount: number;
  currency: string;
  termYears: 1 | 2 | 3;
  createdAt: string;
  expiresAt: string;
}

export interface Payment {
  id: string;
  companyId: string;
  provider: PaymentProvider;
  providerRef: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: string;
}

export type LicenseStatus = "active" | "grace" | "demoted" | "none" | "revoked";

export interface CompanyWithStatus extends Company {
  latestLicense: License | null;
  status: LicenseStatus;
  /** Days remaining in the current state — positive countdown for active/grace, null otherwise. */
  daysRemaining: number | null;
  lastPaymentAt: string | null;
}

/**
 * Mirrors the Gateway's own grace arithmetic (libshard: expires_at + 15
 * days, see the plan's Part 1) so the admin panel's status pill always
 * agrees with what a real running Gateway would do -- never a separate,
 * driftable copy of the rule.
 */
export function computeLicenseStatus(license: License | null, now: Date): { status: LicenseStatus; daysRemaining: number | null } {
  if (!license) return { status: "none", daysRemaining: null };
  if (license.revokedAt) return { status: "revoked", daysRemaining: null };

  const expiresAt = new Date(license.expiresAt);
  const graceDeadline = new Date(expiresAt.getTime() + license.gracePeriodDays * 24 * 60 * 60 * 1000);

  if (now < expiresAt) {
    const daysRemaining = Math.ceil((expiresAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    return { status: "active", daysRemaining };
  }
  if (now < graceDeadline) {
    const daysRemaining = Math.ceil((graceDeadline.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    return { status: "grace", daysRemaining };
  }
  return { status: "demoted", daysRemaining: null };
}
