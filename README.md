# FreelanceCRM
LIVE PREVIEW  AT [https://freelancer-crm.nexuspos.store](https://freelancer-crm.nexuspos.store)
API Docs [https://freelancer-crm.nexuspos.store/api/doc](https://freelancer-crm.nexuspos.store/api/doc)
## Features

- **User Authentication**: Secure login and signup functionality
- **Client Management**: Add, edit, and track client information
- **Project Tracking**: Manage projects with budgets, deadlines, and status updates
- **Interaction Logs**: Record calls, meetings, and emails with clients
- **Reminders**: Create and manage task reminders with due dates
- **Dashboard**: Visualize your business data and performance metrics

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **Styling**: TailwindCSS with dark/light theme support

## Prerequisites

- Node.js 22.x or higher
- PostgreSQL database
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/jobnexus.git
   cd jobnexus
   ```

2. Install dependencies:
   ```
   npm install --legacy-peer-deps
   ```
   > **Note**: The `--legacy-peer-deps` flag is required due to peer dependency issues with the swagger-ui-react package used for API documentation.

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/jobnexus"
   JWT_SECRET="your-secret-key"
   ```

4. Initialize the database:
   ```
   npx prisma migrate dev --name init
   ```
5. Generate the Prisma Client:
   ```
   npx prisma generate
   ```
   
## Running the Application

### Development Mode

Run the development server with Turbopack for faster builds:
```
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

