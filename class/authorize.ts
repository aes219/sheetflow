import { google } from 'googleapis';

async function connect(credentials: string): Promise<any> {
  const auth = await google.auth.getClient({
    keyFile: credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  return auth;
}

export default connect
