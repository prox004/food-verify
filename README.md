# Food Verification System

A Next.js application for managing food collection verification using Google Sheets as the backend with Clerk authentication.

## Features

- 🔐 **Secure Authentication** - Clerk-powered user authentication
- 🔍 **Student Search** - Search for students by roll number (last 3 digits)  
- ✅ **Collection Tracking** - Mark food as collected with timestamp
- 📊 **Multiple Sheets** - Support for different classes/sheets
- ⚡ **Real-time Integration** - Live Google Sheets integration
- 👤 **User Management** - Profile management and user controls

## Setup

### Prerequisites

1. A Google Cloud Console project with Google Sheets API enabled
2. A service account with access to your Google Sheets
3. A Clerk account for authentication
4. Node.js and npm installed

### Authentication Setup (Clerk)

1. Go to [Clerk Dashboard](https://clerk.com)
2. Create a new application
3. Choose your preferred authentication methods (Email, Google, etc.)
4. Copy your API keys from the dashboard
5. Configure the authentication settings as needed

### Google Sheets API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API
4. Create a Service Account:
   - Go to IAM & Admin > Service Accounts
   - Click "Create Service Account"
   - Give it a name and description
   - Click "Create and Continue"
   - Skip role assignment for now
   - Click "Done"
5. Generate a key for the service account:
   - Click on the created service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose JSON format
   - Download the key file

### Environment Configuration

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in the values in `.env.local`:
   
   **Google Sheets API:**
   - `GOOGLE_SHEET_ID`: Found in your Google Sheets URL
   - `GOOGLE_SHEETS_CLIENT_EMAIL`: The `client_email` from your JSON key file
   - `GOOGLE_SHEETS_PRIVATE_KEY`: The `private_key` from your JSON key file (keep the quotes and newlines)
   
   **Clerk Authentication:**
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
   - `CLERK_SECRET_KEY`: Your Clerk secret key

3. Share your Google Sheet with the service account email address (give it Editor access)

### Google Sheets Format

Your sheets should have the following columns:
- **Roll**: Student roll numbers
- **Name**: Student names  
- **Preference**: Food preference (Veg/Non-Veg)
- **Status**: Collection status (will be updated with timestamps)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:9002](http://localhost:9002) in your browser

## Usage

1. Select the appropriate class/sheet from the dropdown
2. Enter the last 3 digits of the student's roll number
3. Click "Search" to find the student
4. Click "Mark as Collected" to update the collection status

## Troubleshooting

### No sheets are loading

This usually means your Google Sheets API credentials are not configured correctly:

1. Check that `.env.local` exists and has all required values
2. Verify that the Google Sheets API is enabled in your Google Cloud project
3. Make sure the service account has access to your Google Sheet
4. Check the console for error messages

### "Sheet is empty or not found" error

1. Verify that the sheet name in the dropdown matches exactly with your Google Sheets tab name
2. Make sure the sheet has the required columns: Roll, Name, Preference, Status
3. Check that there's at least one header row with data

### "Could not find [Column] column" error

Make sure your Google Sheet has columns with these exact names:
- Roll
- Name  
- Preference
- Status
