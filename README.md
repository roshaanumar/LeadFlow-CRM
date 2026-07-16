# LeadFlow CRM

LeadFlow CRM is a modern customer relationship management application built with React Native, Expo, Expo Router, and TypeScript.

The application helps users create, edit, search, filter, track, and manage sales leads through a responsive dark-themed interface. User profiles and lead information are stored locally so they remain available after refreshing or reopening the application.

---

## Live Application

The deployed web application is available at:

**https://leadflow-crm.expo.app**

---

## GitHub Repository

**https://github.com/roshaanumar/LeadFlow-CRM**

---

## Project Overview

LeadFlow CRM was developed as a collaborative software-development project using Git and GitHub.

The project demonstrates:

- React Native application development
- Expo Router navigation
- TypeScript
- React Context API
- Persistent local storage
- Responsive web and mobile design
- Git branching
- Pull requests
- Code review
- Merge-conflict resolution
- Team collaboration
- Web deployment through EAS Hosting

---

## Main Features

### 1. Dashboard

The dashboard provides an overview of the sales pipeline.

It displays:

- Total leads
- Active leads
- Interested leads
- Meetings booked
- Closed deals
- Monthly progress
- Recent leads
- Quick navigation actions

The dashboard statistics are calculated from actual lead data and update automatically whenever a lead is added, edited, or deleted.

---

### 2. Add Lead

Users can create a new lead by entering:

- Contact name
- Company name
- Email address
- Phone number
- Lead status
- Follow-up date
- Notes

The form includes validation for required fields and email format.

---

### 3. Edit Lead

Users can edit an existing lead through the same lead form.

When the Edit button is selected, the form automatically displays the existing lead information.

After updating the lead, the changes are reflected on both the Dashboard and Lead Management screens.

---

### 4. Lead Management

The Lead Management screen allows users to:

- View all saved leads
- Search by contact name
- Search by company name
- Search by email address
- Filter leads by status
- Edit existing leads
- Delete leads
- View contact information
- View follow-up dates
- View the total number of leads

---

### 5. Lead Statuses

The application includes the following lead statuses:

- New
- Contacted
- Interested
- Meeting Booked
- Closed

---

### 6. Persistent Lead Storage

Lead information is stored using AsyncStorage.

This means lead data remains available after:

- Refreshing the browser
- Closing and reopening the application
- Restarting the Expo development server
- Reopening the deployed website

---

### 7. Persistent User Profile

Each user can enter and save their own name.

The saved name is used in:

- The dashboard greeting
- The profile initial

Users can also select **Change name** to update their saved name.

The profile name remains available after refreshing or reopening the application.

---

### 8. Real Monthly Progress

The monthly-progress percentage is calculated using closed deals.

The current monthly target is:

```text
10 closed deals
```

The calculation is:

```text
Monthly Progress = Closed Deals / 10 × 100
```

Examples:

```text
0 closed deals = 0%
2 closed deals = 20%
5 closed deals = 50%
10 closed deals = 100%
```

The progress percentage cannot exceed 100%.

---

## Important Data Information

The current version uses local browser or device storage.

This means:

- Data remains after refreshing.
- Data remains after reopening the application.
- Each browser or device has its own saved data.
- Different users do not automatically share the same leads.
- Clearing browser storage will remove saved leads and profile information.
- A shared online database is not currently connected.

A cloud database such as Firebase or Supabase can be added in a future version.

---

## Technology Stack

- React Native
- Expo
- Expo Router
- TypeScript
- React Context API
- AsyncStorage
- EAS Hosting
- Node.js
- npm
- Git
- GitHub
- Visual Studio Code

---

## Project Structure

```text
LeadFlow-CRM/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── add-lead.tsx
│   │   ├── lead-management.tsx
│   │   └── explore.tsx
│   ├── _layout.tsx
│   └── modal.tsx
├── assets/
├── components/
├── constants/
├── context/
│   ├── LeadContext.tsx
│   └── UserProfileContext.tsx
├── hooks/
├── scripts/
├── types/
│   └── lead.ts
├── app.json
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

## Application Navigation

The application contains three main tabs:

### Dashboard

Displays sales-pipeline statistics, monthly progress, quick actions, and recent leads.

### Add Lead

Allows users to create a new lead or update an existing lead.

### Leads

Displays the Lead Management screen with search, filters, Edit, and Delete functionality.

---

## Installation

### Requirements

Install the following tools before running the project:

- Node.js
- npm
- Git
- Visual Studio Code

---

### Clone the Repository

```bash
git clone https://github.com/roshaanumar/LeadFlow-CRM.git
```

Move into the project folder:

```bash
cd LeadFlow-CRM
```

---

### Install Dependencies

```bash
npm install
```

---

## Run the Web Application

### Windows

```bash
npx.cmd expo start --web
```

### macOS or Linux

```bash
npx expo start --web
```

The application normally opens at:

```text
http://localhost:8081
```

If port `8081` is already being used, Expo may offer another port such as:

```text
http://localhost:8082
```

---

## Run on Mobile

Start the Expo development server:

### Windows

```bash
npx.cmd expo start
```

### macOS or Linux

```bash
npx expo start
```

You can then:

- Scan the QR code using Expo Go
- Open the project using an Android emulator
- Open the project using an iOS simulator on macOS

---

## GitHub Collaboration Workflow

The project was developed using separate feature branches.

Examples of branches used during development:

```text
feature/dashboard
feature/add-edit-lead
feature/lead-management
feature/integrate-lead-navigation
feature/lead-data-store
feature/connect-add-lead-store
feature/integrate-lead-management
feature/persistent-leads
feature/user-profile
chore/eas-hosting
```

---

### Starting a New Feature

```bash
git switch main
git pull origin main
git switch -c feature/feature-name
```

---

### Saving Completed Work

```bash
git status
git add .
git commit -m "Describe the completed feature"
git push -u origin feature/feature-name
```

After pushing, a pull request is created on GitHub.

The pull request is reviewed before being merged into the `main` branch.

---

## Team Contributions

### Project Leader — Roshaan Umar

Responsibilities and contributions:

- Created the initial Expo project
- Created the project folder structure
- Configured the development environment
- Created and managed the GitHub repository
- Added GitHub collaborators
- Developed the LeadFlow Dashboard
- Created the dark LeadFlow user interface
- Managed Expo Router navigation
- Added the Dashboard, Add Lead, and Leads tabs
- Created the shared lead-data store
- Integrated the Add and Edit Lead features
- Connected dashboard statistics to real lead data
- Added monthly-progress calculations
- Added persistent lead storage using AsyncStorage
- Added the persistent user-profile system
- Integrated and styled the Lead Management screen
- Reviewed pull requests
- Resolved merge conflicts
- Tested all integrated features
- Managed Git branches and merges
- Configured EAS Hosting
- Deployed the production web application

---

### Contributor — RafeyRana1

Responsibilities and contributions:

- Developed the Add Lead interface
- Developed the Edit Lead interface
- Added contact-information fields
- Added lead-progress fields
- Added follow-up-date support
- Added notes support
- Added form validation
- Created Add mode
- Created Edit mode
- Created success messages

---

### Contributor — amnatajamal45-debug

Responsibilities and contributions:

- Developed the Lead Management functionality
- Added lead listing
- Added search functionality
- Added status filtering
- Added Edit actions
- Added Delete actions
- Connected the Lead Management screen to the shared lead store

---

## Development and Integration Process

The development process followed these steps:

1. The project leader created the Expo project and GitHub repository.
2. Collaborators were added to the repository.
3. Each team member worked on a separate Git branch.
4. Features were pushed to GitHub.
5. Pull requests were created.
6. Code changes were reviewed before merging.
7. Merge conflicts were resolved when multiple team members edited the same files.
8. Features were integrated into the main application.
9. The complete application was tested locally.
10. The final web application was deployed through EAS Hosting.

---

## Pull Request Workflow

Each completed feature followed this process:

```text
Create Branch
      ↓
Develop Feature
      ↓
Test Locally
      ↓
Commit Changes
      ↓
Push Branch
      ↓
Create Pull Request
      ↓
Review Changes
      ↓
Resolve Conflicts
      ↓
Merge into Main
```

---

## Persistent Storage

The application uses:

```text
@react-native-async-storage/async-storage
```

AsyncStorage is used for:

- Saving lead information
- Loading saved leads
- Saving the user’s profile name
- Loading the saved profile name

Lead information is automatically saved after:

- Adding a lead
- Editing a lead
- Deleting a lead

---

## Deployment

The web application is deployed using Expo EAS Hosting.

### Production URL

**https://leadflow-crm.expo.app**

---

### Export the Web Application

Before deploying new changes, export the web build:

```bash
npx.cmd expo export --platform web
```

For macOS or Linux:

```bash
npx expo export --platform web
```

---

### Deploy to Production

```bash
npx.cmd eas-cli@latest deploy --prod
```

For macOS or Linux:

```bash
npx eas-cli@latest deploy --prod
```

---

## Updating the Live Application

After making and merging new changes:

```bash
git switch main
git pull origin main
npx.cmd expo export --platform web
npx.cmd eas-cli@latest deploy --prod
```

The updated application will be published to:

**https://leadflow-crm.expo.app**

---

## Testing Checklist

The following functionality has been tested:

- Dashboard loads correctly
- Dark theme displays correctly
- Dashboard navigation works
- Add Lead screen opens correctly
- Lead form validation works
- New leads can be added
- New leads appear in Lead Management
- New leads appear in recent leads
- Dashboard totals update automatically
- Active-lead count updates automatically
- Interested-lead count updates automatically
- Meeting count updates automatically
- Closed-deal count updates automatically
- Monthly progress updates automatically
- Search by contact name works
- Search by company name works
- Search by email works
- Status filters work
- Edit Lead opens with existing data
- Lead information can be updated
- Updated information appears throughout the app
- Leads can be deleted
- Deleted leads disappear from the Dashboard
- Deleted leads disappear from Lead Management
- Leads remain after refreshing
- User profile name remains after refreshing
- Profile initial displays correctly
- Production deployment opens correctly

---

## Current Limitations

- There is no full registration or login system.
- Lead information is stored locally.
- Different devices do not share the same lead information.
- Different browsers do not share the same lead information.
- There is no connected cloud database.
- There are no email or push notifications.
- The monthly target is currently fixed at 10 closed deals.
- There is no role-based access control.
- Clearing browser storage removes locally saved information.

---

## Future Improvements

Possible future improvements include:

- User registration
- Secure login
- Firebase integration
- Supabase integration
- Shared cloud database
- Shared team workspaces
- Role-based permissions
- Admin and employee accounts
- Lead assignment to team members
- Custom monthly targets
- Sales-performance charts
- Lead-conversion analytics
- Follow-up notifications
- Email reminders
- Push notifications
- CSV import
- CSV export
- PDF reports
- Lead sorting
- Advanced filtering
- Delete confirmation dialogs
- Password recovery
- Profile pictures
- Dark and light theme switching
- Android application publishing
- iOS application publishing

---

## Educational Purpose

This project was created for educational and academic purposes.

It demonstrates practical experience with:

- Mobile and web development
- React Native
- TypeScript
- State management
- Persistent storage
- Git
- GitHub
- Team collaboration
- Pull requests
- Merge-conflict resolution
- Application deployment

---

## Authors

- Roshaan Umar
- RafeyRana1
- amnatajamal45-debug

---

## License

This project is intended for educational and academic use.
