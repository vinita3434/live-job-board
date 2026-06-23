export type ATS =
  | "greenhouse"
  | "lever"
  | "ashby"
  | "workday"
  | "smartrecruiters"
  | "gem"
  | "icims"
  | "microsoft"
  | "amazon"
  | "google";

export interface WorkdayConfig {
  /** full myworkdayjobs host, e.g. "salesforce.wd12.myworkdayjobs.com" */
  host: string;
  /** CXS tenant — usually the same as the host subdomain, e.g. "salesforce" */
  tenant: string;
  /** site/job-board name, the path after the host, e.g. "External_Career_Site" */
  site: string;
}

export interface CompanyConfig {
  name: string;
  ats: ATS;
  /** identifier in the careers URL (for Workday, use the tenant) */
  slug: string;
  /** section grouping in the UI */
  category?: string;
  /** required only when ats === "workday" */
  workday?: WorkdayConfig;
  /** required only when ats === "icims" — the careers host, e.g. "careers-acme.icims.com" */
  icims?: { host: string };
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyId: string;
  category: string;
  location: string;
  department: string;
  url: string;
  updatedAt: string | null;
}

export interface SourceStatus {
  id: string;
  name: string;
  ats: ATS;
  slug: string;
  category: string;
  ok: boolean;
  count: number;
  error?: string;
}

export interface BoardData {
  jobs: Job[];
  sources: SourceStatus[];
  fetchedAt: string;
}
