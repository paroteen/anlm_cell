import { User, Cell, Member, AttendanceRecord, Role, MemberStatus, AttendanceStatus, Material, Announcement, CellReport, SessionSummary, CellAttendanceOverview } from '../types';

// --- SEED DATA (Rwandan Context) ---

const users: User[] = [
  { id: 'u1', name: 'Pastor Gatera', email: 'admin@newlife.org', role: Role.ADMIN, password: 'password123' },
  { id: 'u2', name: 'Uwase Claudine', email: 'uwase@newlife.org', role: Role.LEADER, cellId: 'c1', password: 'password123' },
  { id: 'u3', name: 'Mugabo Jean', email: 'mugabo@newlife.org', role: Role.LEADER, cellId: 'c2', password: 'password123' },
  { id: 'u4', name: 'Iribagiza Grace', email: 'grace@newlife.org', role: Role.LEADER, cellId: 'c3', password: 'password123' },
];

const cells: Cell[] = [
  { id: 'c1', name: 'Kabeza Cell', leaderId: 'u2', leaderName: 'Uwase Claudine', location: 'Kabeza Near Market', meetingDay: 'Wednesday' },
  { id: 'c2', name: 'Kanombe Cell', leaderId: 'u3', leaderName: 'Mugabo Jean', location: 'Kanombe EFOTEC', meetingDay: 'Wednesday' },
  { id: 'c3', name: 'Kicukiro Cell', leaderId: 'u4', leaderName: 'Iribagiza Grace', location: 'Kicukiro Centre', meetingDay: 'Thursday' },
];

const members: Member[] = [
  // Kabeza Members
  { id: 'm1', fullName: 'Keza Sandrine', phone: '0788123456', gender: 'Female', ageRange: '25-35', address: 'Kabeza', cellId: 'c1', status: MemberStatus.ACTIVE, joinedDate: '2023-01-15', lastAttendedDate: '2023-10-25' },
  { id: 'm2', fullName: 'Nshimiyimana Eric', phone: '0788654321', gender: 'Male', ageRange: '36-45', address: 'Samuduha', cellId: 'c1', status: MemberStatus.ACTIVE, joinedDate: '2023-02-10', lastAttendedDate: '2023-10-18' },
  
  // Kanombe Members
  { id: 'm3', fullName: 'Mutoni Alice', phone: '0788111222', gender: 'Female', ageRange: '18-24', address: 'Kanombe', cellId: 'c2', status: MemberStatus.ACTIVE, joinedDate: '2023-03-05', lastAttendedDate: '2023-10-25' },
  { id: 'm4', fullName: 'Gasana Patrick', phone: '0788333444', gender: 'Male', ageRange: '25-35', address: 'Busanza', cellId: 'c2', status: MemberStatus.INACTIVE, joinedDate: '2023-01-20', lastAttendedDate: '2023-08-15' },
  
  // Kicukiro Members
  { id: 'm5', fullName: 'Uwamahoro Sarah', phone: '0788555666', gender: 'Female', ageRange: '25-35', address: 'Kicukiro', cellId: 'c3', status: MemberStatus.ACTIVE, joinedDate: '2023-06-01', lastAttendedDate: '2023-10-11' },
];

const attendance: AttendanceRecord[] = [
  { id: 'a1', date: '2023-10-25', cellId: 'c1', memberId: 'm1', status: AttendanceStatus.PRESENT },
  { id: 'a2', date: '2023-10-25', cellId: 'c1', memberId: 'm2', status: AttendanceStatus.ABSENT, notes: 'Traveling to Musanze' },
  { id: 'a3', date: '2023-10-18', cellId: 'c1', memberId: 'm1', status: AttendanceStatus.PRESENT },
  { id: 'a4', date: '2023-10-18', cellId: 'c1', memberId: 'm2', status: AttendanceStatus.PRESENT },
  // Old data for c2
  { id: 'a5', date: '2023-10-25', cellId: 'c2', memberId: 'm3', status: AttendanceStatus.PRESENT },
  { id: 'a6', date: '2023-10-25', cellId: 'c2', memberId: 'm4', status: AttendanceStatus.ABSENT },
];

const materials: Material[] = [
  { id: 'mat1', title: 'Week 1: Foundations of Faith', description: 'Study guide for cell groups regarding the new sermon series.', type: 'PDF', date: '2023-11-01', url: '#' },
  { id: 'mat2', title: 'Sunday Recap: The Holy Spirit', description: 'Discussion questions from last Sunday service.', type: 'TEXT', date: '2023-11-08', url: '#' },
  { id: 'mat3', title: 'Worship Highlights', description: 'Video from Sunday.', type: 'VIDEO', date: '2023-11-05', url: '#' },
];

const announcements: Announcement[] = [
  { 
    id: 'ann1', 
    title: 'One Service This Sunday', 
    content: 'Important: This Sunday we will have a combined service starting at 9:00 AM. Please inform all cell members.', 
    date: new Date().toISOString().split('T')[0], 
    priority: 'HIGH',
    author: 'Admin'
  },
  { 
    id: 'ann2', 
    title: 'Cell Leader Training', 
    content: 'All leaders are requested to attend a brief training next Saturday at the main campus.', 
    date: '2023-10-28', 
    priority: 'NORMAL',
    author: 'Admin'
  }
];

// --- MOCK SERVICE API ---

export const MockService = {
  login: async (email: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 500)); 
    return users.find(u => u.email === email) || null;
  },

  // --- User Management ---
  getUsers: async (): Promise<User[]> => {
    return [...users];
  },

  addUser: async (user: Omit<User, 'id'>) => {
    const newUser = { ...user, id: Math.random().toString(36).substr(2, 9) };
    users.push(newUser);
    return newUser;
  },

  updateUser: async (id: string, updates: Partial<User>) => {
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      // If role changed to Admin, remove cellId
      if (updates.role === Role.ADMIN) {
        users[idx].cellId = undefined;
      }
    }
  },

  // --- Cells ---
  getCells: async (): Promise<Cell[]> => {
    return [...cells];
  },

  addCell: async (cell: Omit<Cell, 'id' | 'leaderName'>): Promise<Cell> => {
    const leader = users.find(u => u.id === cell.leaderId);
    const newCell = {
      ...cell,
      id: Math.random().toString(36).substr(2, 9),
      leaderName: leader ? leader.name : 'Unassigned'
    };
    cells.push(newCell);
    if (leader) {
      leader.cellId = newCell.id;
    }
    return newCell;
  },

  getLeaders: async (): Promise<User[]> => {
    return users.filter(u => u.role === Role.LEADER);
  },

  updateCellLeader: async (cellId: string, leaderId: string) => {
    const cell = cells.find(c => c.id === cellId);
    const newLeader = users.find(u => u.id === leaderId);
    
    if (cell && newLeader) {
      cell.leaderId = newLeader.id;
      cell.leaderName = newLeader.name;
      users.forEach(u => {
        if (u.cellId === cellId) u.cellId = undefined; 
      });
      newLeader.cellId = cellId;
    }
  },

  getMembers: async (cellId?: string): Promise<Member[]> => {
    if (cellId) return members.filter(m => m.cellId === cellId);
    return [...members];
  },

  getMemberHistory: async (memberId: string): Promise<AttendanceRecord[]> => {
    return attendance.filter(a => a.memberId === memberId).sort((a,b) => b.date.localeCompare(a.date));
  },

  addMember: async (member: Omit<Member, 'id' | 'joinedDate'>): Promise<Member> => {
    const newMember: Member = {
      ...member,
      id: Math.random().toString(36).substr(2, 9),
      joinedDate: new Date().toISOString().split('T')[0],
      status: MemberStatus.ACTIVE
    };
    members.push(newMember);
    return newMember;
  },

  // --- Attendance ---

  getAttendance: async (cellId: string, date: string): Promise<AttendanceRecord[]> => {
    return attendance.filter(a => a.cellId === cellId && a.date === date);
  },

  saveAttendance: async (records: AttendanceRecord[]) => {
    if (records.length === 0) return;
    const { cellId, date } = records[0];
    let index = attendance.findIndex(a => a.cellId === cellId && a.date === date);
    while (index !== -1) {
       attendance.splice(index, 1);
       index = attendance.findIndex(a => a.cellId === cellId && a.date === date);
    }
    attendance.push(...records);
    records.forEach(r => {
      if (r.status === AttendanceStatus.PRESENT) {
        const mem = members.find(m => m.id === r.memberId);
        if (mem) {
          if (!mem.lastAttendedDate || new Date(r.date) > new Date(mem.lastAttendedDate)) {
             mem.lastAttendedDate = r.date;
          }
        }
      }
    });
  },

  // New: Get summaries of past sessions for a cell
  getSessionLog: async (cellId: string): Promise<SessionSummary[]> => {
    const cellRecords = attendance.filter(a => a.cellId === cellId);
    const uniqueDates = Array.from(new Set(cellRecords.map(a => a.date)));
    
    return uniqueDates.map(date => {
      const recordsForDate = cellRecords.filter(a => a.date === date);
      return {
        date,
        present: recordsForDate.filter(a => a.status === AttendanceStatus.PRESENT).length,
        absent: recordsForDate.filter(a => a.status === AttendanceStatus.ABSENT).length,
        excused: recordsForDate.filter(a => a.status === AttendanceStatus.EXCUSED).length,
        total: recordsForDate.length
      };
    }).sort((a,b) => b.date.localeCompare(a.date));
  },

  // New: Get high-level overview of all cells for Admin
  getAttendanceOverview: async (): Promise<CellAttendanceOverview[]> => {
    return cells.map(cell => {
      const cellMembers = members.filter(m => m.cellId === cell.id);
      const cellRecords = attendance.filter(a => a.cellId === cell.id);
      
      // Find latest date
      const uniqueDates = Array.from(new Set(cellRecords.map(a => a.date))).sort((a,b) => b.localeCompare(a));
      const latestDate = uniqueDates.length > 0 ? uniqueDates[0] : null;
      
      let present = 0;
      let absent = 0;

      if (latestDate) {
        const recordsForDate = cellRecords.filter(a => a.date === latestDate);
        present = recordsForDate.filter(a => a.status === AttendanceStatus.PRESENT).length;
        absent = recordsForDate.filter(a => a.status === AttendanceStatus.ABSENT).length;
      }

      return {
        cellId: cell.id,
        cellName: cell.name,
        leaderName: cell.leaderName,
        totalMembers: cellMembers.length,
        lastSessionDate: latestDate,
        lastSessionPresent: present,
        lastSessionAbsent: absent
      };
    });
  },

  getFollowUps: async (user: User): Promise<any[]> => {
    const targetMembers = user.role === Role.ADMIN 
      ? members 
      : members.filter(m => m.cellId === user.cellId);

    const followUps: any[] = [];
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    targetMembers.forEach(m => {
      if (m.status !== MemberStatus.ACTIVE) return;
      const last = m.lastAttendedDate ? new Date(m.lastAttendedDate) : new Date(m.joinedDate);
      if (last < twoWeeksAgo) {
        followUps.push({
          id: m.id,
          name: m.fullName,
          phone: m.phone,
          address: m.address,
          lastAttended: m.lastAttendedDate || 'Never',
          daysSince: Math.floor((new Date().getTime() - last.getTime()) / (1000 * 3600 * 24)),
          cellName: cells.find(c => c.id === m.cellId)?.name || 'Unknown'
        });
      }
    });
    return followUps;
  },
  
  getWeeklyStats: async (): Promise<any[]> => {
    return [
      { name: '3 Weeks Ago', attendance: 85 },
      { name: '2 Weeks Ago', attendance: 92 },
      { name: 'Last Week', attendance: 78 },
      { name: 'This Week', attendance: 88 },
    ];
  },

  getCellReports: async (): Promise<CellReport[]> => {
    return cells.map(cell => {
      const cellMembers = members.filter(m => m.cellId === cell.id);
      const rate = Math.floor(Math.random() * (100 - 60) + 60); 
      return {
        cellId: cell.id,
        cellName: cell.name,
        leaderName: cell.leaderName,
        memberCount: cellMembers.length,
        avgAttendance: rate,
        status: rate > 80 ? 'HEALTHY' : 'NEEDS_ATTENTION'
      };
    });
  },

  getMaterials: async (): Promise<Material[]> => {
    return [...materials].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  addMaterial: async (mat: Omit<Material, 'id'>) => {
    const newMat = { ...mat, id: Math.random().toString(36).substr(2, 9) };
    materials.unshift(newMat);
    return newMat;
  },

  // --- Announcements ---
  getAnnouncements: async (): Promise<Announcement[]> => {
    return [...announcements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  addAnnouncement: async (ann: Omit<Announcement, 'id'>) => {
    const newAnn = { ...ann, id: Math.random().toString(36).substr(2, 9) };
    announcements.unshift(newAnn);
    return newAnn;
  }
};