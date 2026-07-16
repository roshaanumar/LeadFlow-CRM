export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Interested'
  | 'Meeting Booked'
  | 'Closed'
  | 'Lost';

export interface Lead {
  id: string;
  contactName: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  followUpDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}