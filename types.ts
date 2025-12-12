
export type Language = 'ms' | 'en' | 'zh' | 'ta';

export enum Tab {
  HOME = 'home',
  CHAT = 'chat',
  NOTIFICATIONS = 'notifications',
  PERSONAL = 'personal',
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  merchant?: string;
}

export interface Doc {
  id: string;
  name: string;
  date: string;
  size: string;
  type: 'pdf' | 'img';
  fileUrl?: string;
}

export interface SubsidyProgram {
  id: string;
  programName: string;
  programCode: string;
  category: 'groceries' | 'fuel' | 'oku' | 'elderly' | 'children' | 'medical' | 'selangor' | 'essentials';
  icon: string;
  currentBalance: number;
  totalAllocated: number;
  monthlyCredit: number;
  nextCreditDate: string | null;
  expiryDate: string | null;
  remainingQuota: number | null;
  quotaUnit: 'litres' | 'visits' | 'RM' | null;
  eligibilityStatus: 'eligible' | 'not_eligible' | 'pending' | 'rejected';
  applicationStatus: 'approved' | 'not_started' | 'documents_required' | 'processing' | 'rejected' | 'draft' | 'submitted';
  isVerified: boolean;
  transactions: Transaction[];
  allowedItems?: string[];
  allowedCategories?: string[];
  programDescription: string;
  eligibilityCriteria: string[];
  benefitAmount: string;
  renewalRules: string;
  conditions: string[];
  limitations: string[];
  faq: { question: string; answer: string }[];
  alertMessage?: string;
  alertType?: 'info' | 'warning' | 'urgent';
  color: string;
}

export interface NotificationItem {
  id: string;
  type: 'priority' | 'status' | 'news';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  imageUrl?: string;
}

export interface UserProfile {
  name: string;
  icNumber: string;
  householdSize: number;
  householdIncome: number;
  address: string;
  ageCategory: string;
  vehicles: { plate: string; roadTaxExpiry: string }[];
  isOku: boolean;
  hasChildren: boolean;
  childrenCount: number;
  hasSeniorDependents: boolean;
  seniorDependentsCount: number;
  myDigitalIdVerified: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isEligibilityCard?: boolean;
  groundingMetadata?: any;
  relatedProgramId?: string;
}
