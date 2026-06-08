import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

export type Role = "USER" | "ADMIN";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface LinkFormData {
  url: string;
  slug?: string;
  domain?: string;
  title?: string;
  description?: string;
  tags?: string[];
  category?: string;
  password?: string;
  expiresAt?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

export interface AnalyticsData {
  totalClicks: number;
  uniqueClicks: number;
  dailyBreakdown: DailyClickData[];
  topReferrers: TopItem[];
  topCountries: TopItem[];
  topBrowsers: TopItem[];
  topDevices: TopItem[];
}

export interface DailyClickData {
  date: string;
  clicks: number;
  uniqueClicks: number;
}

export interface TopItem {
  name: string;
  count: number;
  percentage: number;
}

export interface ClickEvent {
  id: string;
  linkId: string;
  timestamp: Date;
  ip: string | null;
  userAgent: string | null;
  referer: string | null;
  country: string | null;
  city: string | null;
  region: string | null;
  browser: string | null;
  os: string | null;
  device: string | null;
  isUnique: boolean;
}

export interface TeamData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  role: string;
  memberCount: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface DateRangeParams {
  from?: string;
  to?: string;
}
