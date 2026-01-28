# NewLife Bible Church - Cell Management System

## Overview
The **NewLife Cell Management System** is a role-based web application designed to help NewLife Bible Church manage cell groups (small groups), track member attendance, facilitate pastoral care through follow-ups, and distribute study resources.

The system features a custom design using the church's brand colors (Green, Dark Chocolate, and Ache) and is localized with Rwandan names and locations.

## Key Features

### 1. Dashboard
- **Personalized View**: tailored for Admins or Cell Leaders.
- **Announcements**: Admins can post global announcements (Normal or High Priority) visible to all leaders.
- **Statistics**: Real-time view of total members, attendance rates, and active cells.
- **Priority Follow-ups**: Automated list of members who have missed recent meetings (absent > 2 weeks).
- **Charts**: Visual attendance trends over the last 4 weeks.

### 2. Attendance Tracking
- **Hierarchical View**:
  1. **Admin Overview**: High-level summary of all cells and their latest meeting stats.
  2. **Session Log**: History of all previous meetings with Present/Absent counts.
  3. **Register View**: Detailed list to mark members as Present, Absent, or Excused with optional notes.
- **Filtering**: Filter attendance lists by status.
- **Date Flexibility**: Leaders can record attendance for past dates or create new sessions.

### 3. Member Management
- **Directory**: Searchable list of members by name or phone.
- **Status Tracking**: Filter by Active, Inactive, or Moved members.
- **Registration**: Simple form to add new members to a specific cell.
- **Contact Info**: Quick access to phone numbers and addresses.

### 4. Cell & User Management (Admin Only)
- **Cell Network**: Create new cells, view cell locations, and assign/change leaders.
- **User Control**: Create system accounts, generate passwords, and assign roles (Admin/Leader).

### 5. Resources
- **Material Distribution**: Central repository for weekly study guides, videos, and announcements.
- **Format Support**: Supports PDF, Video links, and Text content.
- **Preview**: Built-in modal to preview materials without downloading.

### 6. Reports (Admin Only)
- **Performance Analysis**: Table view of all cells ranked by health status.
- **Health Indicators**: automatic flagging of cells as "Healthy" or "Needs Attention" based on attendance rates.

---

## User Roles & Credentials

The system uses a mock authentication service. You can use the following credentials to test different perspectives:

### 1. System Admin
*Full access to all cells, reports, user management, and announcements.*
- **Email**: `admin@newlife.org`
- **Password**: (Any, e.g., `password123`)

### 2. Cell Leader (Kabeza Cell)
*Access to Kabeza cell data, attendance, and resources.*
- **Email**: `uwase@newlife.org`
- **Password**: (Any)

### 3. Cell Leader (Kanombe Cell)
*Access to Kanombe cell data.*
- **Email**: `mugabo@newlife.org`
- **Password**: (Any)

---

## Technical Stack

- **Frontend Framework**: React 19 (Functional Components with Hooks)
- **Styling**: Tailwind CSS (Custom configured color palette)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Language**: TypeScript
- **Data**: In-memory Mock Service (`services/mockData.ts`) simulates a backend database.

## Project Structure

```
/
├── index.html              # Entry point with Tailwind config
├── index.tsx               # React root mount
├── App.tsx                 # Main routing logic
├── types.ts                # TypeScript interfaces (User, Cell, Member, etc.)
├── services/
│   └── mockData.ts         # Mock database and API methods
└── components/
    ├── Layout.tsx          # Sidebar and responsive layout wrapper
    ├── Login.tsx           # Authentication screen
    ├── Dashboard.tsx       # Main landing page with stats
    ├── Attendance.tsx      # Attendance logging logic
    ├── Members.tsx         # Member directory
    ├── Resources.tsx       # Study materials
    ├── UserManagement.tsx  # (Admin) System user creation
    ├── CellManagement.tsx  # (Admin) Cell network structure
    └── Reports.tsx         # (Admin) Analytics
```

## How to Run

1. Ensure you have a Node.js environment.
2. If using a local setup (Vite/CRA):
   - Copy the files into your `src` folder.
   - Install dependencies: `npm install react react-dom lucide-react recharts`.
   - Run `npm run dev` or `npm start`.
3. If using an online playground (StackBlitz/CodeSandbox):
   - The files are ready to run as provided.

---
*Built for NewLife Bible Church.*
