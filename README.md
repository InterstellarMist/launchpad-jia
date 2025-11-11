# Jia Web Application

Jia is a web application built with Next.js that appears to provide interview assistance, opportunity management, and communication tools. This README provides comprehensive information about the project, how to set it up, run it, and deploy it.

## Whitecloak Launchpad Sprint Features

This section documents the features implemented during the Whitecloak Launchpad program sprint round.

### 1. Local Environment Setup Flow

A comprehensive setup flow has been established to properly configure the local development environment with proper user roles and organization structure:

**Setup Flow:**

1. **Create Super Admin Account in MongoDB**

   - Manually create a super admin account in your MongoDB database with appropriate permissions

2. **Sign Up Using Super Admin Email**

   - Use the super admin email to sign up through the application's authentication system

3. **Create Organization via Admin Portal**

   - Navigate to `/admin-portal`
   - Create a new organization
   - Add an admin as a recruiter account (you can also add yourself for testing purposes)

4. **Sign Up Using Recruiter Email**

   - Sign up using the recruiter email that was added to the organization

5. **Create Organization Plans**
   - Create organization plans in MongoDB with the following structure:
   ```json
   [
     {
       "_id": "plan-enterprise",
       "name": "Enterprise",
       "jobLimit": 100
     }
   ]
   ```

### 2. Segmented Career Form Implementation

The add career page has been redesigned and implemented as a segmented form that:

- Follows the existing codebase style and patterns
- Adheres to the specified Figma prototype designs
- Provides an improved user experience with step-by-step form completion
- Maintains consistency with previous form implementations in the codebase
- Uses **react-hook-form** for form state management and validation
- Implements **Zod** schema validation for type-safe form validation
- Organized into 5 distinct sections:
  1. Career Details & Team Access
  2. CV Review & Pre-Screening
  3. AI Interview Setup
  4. Pipeline Stages
  5. Review Career

**Location:** `/src/lib/components/CareerComponents/FormComponents/CareerFormV2.tsx`

### 3. XSS Protection in Career API

HTML sanitization has been implemented in the `/api/add-career` endpoint to secure against Cross-Site Scripting (XSS) attacks:

- **HTML Sanitization**: All HTML content (such as job descriptions) is sanitized before being stored in the database
- **Text Sanitization**: Text fields (job title, employment type, work setup, location fields) are sanitized to prevent malicious input
- **Implementation**: Uses server-side sanitization utilities (`sanitizeHtml` and `sanitizeText`) to clean user input before database insertion

**Security Benefits:**

- Prevents XSS attacks through malicious HTML/JavaScript injection
- Ensures data integrity and application security
- Protects both stored data and rendered content

**Location:** `/src/app/api/add-career/route.ts`

### 4. Pre-screening Questions Integration

The `/dashboard/upload-cv` page has been updated to include Pre-screening questions in the screening process:

- Pre-screening questions are now integrated into the CV upload and screening workflow
- Questions are presented to applicants during the CV upload process
- Responses are captured and stored as part of the screening data

**Location:** `/src/lib/components/screens/UploadCV.tsx`

---

## Tech Stack

- **Frontend**:

  - Next.js 15.x (with App Router)
  - React 19.x
  - SASS for styling
  - TypeScript

- **Backend**:

  - Next.js API Routes (serverless functions)
  - MongoDB for database
  - Firebase for authentication and storage

- **APIs & Services**:

  - OpenAI API integration
  - Socket.io for real-time communication

- **DevOps**:
  - Vercel for deployment
  - Git for version control

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- MongoDB account (for database connection)
- Firebase account (for authentication)
- OpenAI API key

## Getting Started

### Setting Up Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Fill in the required environment variables in `.env`:

```
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Firebase
FIREBASE_SERVICE_ACCOUNT=your_firebase_service_account_json

# App Configuration
NEXT_PUBLIC_CORE_API_URL=your_backend_api_url
```

### Installing Dependencies

Using npm:

```bash
npm install
```

Using yarn:

```bash
yarn install
```

### Running Locally

Development mode with hot reloading (using Turbopack):

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

```bash
npm run build
# or
yarn build
```

### Starting Production Server

```bash
npm run start
# or
yarn start
```

### Additional Scripts

Clean project (removes node_modules, .next, bun.lock, next-env.d.ts):

```bash
npm run clean
# or
yarn clean
```

## Project Structure

```
jia-web-app/
├── .env                 # Environment variables
├── .env.example         # Example environment configuration
├── .gitignore           # Git ignore file
├── next-env.d.ts        # TypeScript declarations for Next.js
├── package.json         # Project dependencies and scripts
├── public/              # Static assets
├── src/                 # Source code
│   ├── app/             # Next.js App Router structure
│   │   ├── api/         # API routes
│   │   ├── dashboard/   # Dashboard page
│   │   ├── interview/   # Interview related pages
│   │   ├── login/       # Authentication pages
│   │   ├── my-interviews/ # User interviews management
│   │   ├── applicant/ # Applicant tracking
│   │   ├── talk/        # Communication features
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Home page
│   ├── contexts/        # React contexts
│   └── lib/             # Shared libraries and utilities
│       ├── components/  # Reusable UI components
│       ├── context/     # Context providers
│       ├── firebase/    # Firebase configuration
│       ├── mongoDB/     # MongoDB utilities
│       ├── styles/      # Global styles
│       ├── Modal/       # Modal components
│       ├── Loader/      # Loading UI components
│       ├── PageComponent/ # Page-specific components
│       └── VoiceAssistant/ # Voice interaction features
└── tsconfig.json        # TypeScript configuration
```

## Key Features

- App Router-based routing system
- Authentication with Firebase
- Data storage with MongoDB
- Real-time communication with Socket.io
- AI-powered features using OpenAI

## Deployment with Vercel

### Preparing for Deployment

1. Make sure your project is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

2. Ensure all environment variables are properly set in your local `.env` file.

### Deploying to Vercel

1. Create an account on [Vercel](https://vercel.com) if you don't have one.

2. From the Vercel dashboard, click "New Project".

3. Import your Git repository.

4. Configure project:

   - Set the framework preset to "Next.js"
   - Configure the environment variables (copy from your `.env` file)
   - Add any additional build settings if needed

5. Click "Deploy".

### Updating Environment Variables on Vercel

1. Go to your project on Vercel dashboard.
2. Navigate to "Settings" > "Environment Variables".
3. Add or update your environment variables as needed.
4. Redeploy your application for the changes to take effect.

### Setting up a Custom Domain

1. In your Vercel project, go to "Settings" > "Domains".
2. Add your custom domain and follow the verification steps.

## Contributing

Please follow the existing code style and organization when contributing to the project. Make use of TypeScript for type safety.

## Troubleshooting

- If you encounter issues with the MongoDB connection, verify your connection string and network access settings.
- For Firebase authentication problems, check your Firebase service account credentials.
- For development issues, try running `npm run clean` followed by `npm install` and `npm run dev`.
