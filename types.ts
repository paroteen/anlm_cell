export enum Role {
  ADMIN = 'ADMIN',
  LEADER = 'LEADER',
}

export enum MemberStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MOVED = 'MOVED',
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  EXCUSED = 'EXCUSED',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  cellId?: string; // If leader, which cell they lead
  password?: string; // For simulation
}

export interface Cell {
  id: string;
  name: string;
  leaderId: string; // The ID of the User who leads this
  leaderName: string;
  location: string;
  meetingDay: string; // Usually "Wednesday"
}

export interface Member {
  id: string;
  fullName: string;
  phone: string;
  gender: 'Male' | 'Female';
  ageRange: string;
  address: string;
  cellId: string;
  status: MemberStatus;
  joinedDate: string;
  lastAttendedDate?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // ISO Date string YYYY-MM-DD
  cellId: string;
  memberId: string;
  status: AttendanceStatus;
  notes?: string; // Follow-up notes
}

export interface FollowUpTask {
  id: string;
  memberId: string;
  memberName: string;
  cellId: string;
  absentCount: number;
  lastAttended: string;
  status: 'PENDING' | 'COMPLETED';
}

export interface Material {
  id: string;
  title: string;
  description: string;
  type: 'PDF' | 'VIDEO' | 'TEXT';
  date: string; // Release date
  url?: string; // Mock URL
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'HIGH' | 'NORMAL';
  author: string;
}

export interface CellReport {
  cellId: string;
  cellName: string;
  leaderName: string;
  memberCount: number;
  avgAttendance: number;
  status: 'HEALTHY' | 'NEEDS_ATTENTION';
}

export interface SessionSummary {
  date: string;
  present: number;
  absent: number;
  excused: number;
  total: number;
}

export interface CellAttendanceOverview {
  cellId: string;
  cellName: string;
  leaderName: string;
  totalMembers: number;
  lastSessionDate: string | null;
  lastSessionPresent: number;
  lastSessionAbsent: number;
}