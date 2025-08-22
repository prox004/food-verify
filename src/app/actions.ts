'use server';

import { google } from 'googleapis';

export interface StudentData {
  rowIndex: number; // To keep track of the row for updates
  Roll: string;
  Name: string;
  Preference: string;
  Status: string; // Changed from Collected
  statusColumn: string; // To hold the column letter e.g. 'D'
}

// Configure Google Sheets API client
const getSheetsClient = async () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: authClient });
  return sheets;
};

// Helper to validate environment variables
const validateEnv = () => {
  if (
    !process.env.GOOGLE_SHEET_ID ||
    !process.env.GOOGLE_SHEETS_CLIENT_EMAIL ||
    !process.env.GOOGLE_SHEETS_PRIVATE_KEY
  ) {
    throw new Error('Google Sheets API credentials are not configured in .env.local');
  }
};

export async function getSheets(): Promise<string[]> {
  try {
    validateEnv();
    const sheets = await getSheetsClient();
    const res = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
    });

    const sheetNames = res.data.sheets?.map((s) => s.properties?.title || '').filter(Boolean);
    return sheetNames || [];
  } catch (error) {
    console.error('API Error (getSheets):', error);
    return [];
  }
}

// Helper to convert column index to letter (0 -> A, 1 -> B)
const colIndexToLetter = (colIndex: number) => {
  let temp, letter = '';
  while (colIndex >= 0) {
    temp = colIndex % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    colIndex = Math.floor(colIndex / 26) - 1;
  }
  return letter;
}

export async function searchRollNumber(
  sheetName: string,
  rollSuffix: string
): Promise<{ data: StudentData | null; error: string | null }> {
  if (!/^\d{3}$/.test(rollSuffix)) {
    return { data: null, error: 'Please enter the last 3 digits of the roll number.' };
  }

  try {
    validateEnv();
    const sheets = await getSheetsClient();
    const range = `${sheetName}!A:Z`; // Read a wider range to find columns dynamically

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: range,
    });

    const rows = res.data.values;
    if (!rows || rows.length === 0) {
      return { data: null, error: 'Sheet is empty or not found.' };
    }

    const header = rows[0];
    const rollIndex = header.indexOf('Roll');
    const nameIndex = header.indexOf('Name');
    const preferenceIndex = header.indexOf('Preference');
    const statusIndex = header.indexOf('Status'); // Find status column

    if (rollIndex === -1) return { data: null, error: 'Could not find "Roll" column.' };
    if (nameIndex === -1) return { data: null, error: 'Could not find "Name" column.' };
    if (preferenceIndex === -1) return { data: null, error: 'Could not find "Preference" column.' };
    if (statusIndex === -1) return { data: null, error: 'Could not find "Status" column.' };
    
    const statusColumnLetter = colIndexToLetter(statusIndex);

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const rollNumber = row[rollIndex];
      if (rollNumber && rollNumber.endsWith(rollSuffix)) {
        const studentData: StudentData = {
          rowIndex: i + 1, // 1-based index
          Roll: row[rollIndex] || '',
          Name: row[nameIndex] || '',
          Preference: row[preferenceIndex] || '',
          Status: row[statusIndex] || 'Not Collected',
          statusColumn: statusColumnLetter,
        };
        return { data: studentData, error: null };
      }
    }

    return { data: null, error: 'Roll number not found in this sheet.' };
  } catch (error: any) {
    console.error('API Error (searchRollNumber):', error);
    return { data: null, error: `API Error: ${error.message}` };
  }
}

export async function markAsCollected(
  sheetName: string,
  rowIndex: number,
  statusColumn: string,
): Promise<{ success: boolean; error: string | null }> {
  try {
    validateEnv();
    const sheets = await getSheetsClient();
    const range = `${sheetName}!${statusColumn}${rowIndex}`;
    const timestamp = new Date().toISOString();

    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[timestamp]],
      },
    });

    return { success: true, error: null };
  } catch (error: any) {
    console.error('API Error (markAsCollected):', error);
    return { success: false, error: `API Error: ${error.message}` };
  }
}
