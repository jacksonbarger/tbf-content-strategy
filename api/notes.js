import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const sql = neon(process.env.DATABASE_URL);

    try {
        // Create table if not exists
        await sql`
            CREATE TABLE IF NOT EXISTS notes (
                tab VARCHAR(50) PRIMARY KEY,
                content TEXT,
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `;

        if (req.method === 'GET') {
            // Fetch all notes
            const notes = await sql`SELECT tab, content FROM notes`;
            const notesObj = {};
            notes.forEach(row => {
                notesObj[row.tab] = row.content || '';
            });
            return res.status(200).json(notesObj);
        }

        if (req.method === 'POST') {
            const { tab, content } = req.body;

            if (!tab) {
                return res.status(400).json({ error: 'Tab is required' });
            }

            // Upsert note
            await sql`
                INSERT INTO notes (tab, content, updated_at)
                VALUES (${tab}, ${content || ''}, NOW())
                ON CONFLICT (tab)
                DO UPDATE SET content = ${content || ''}, updated_at = NOW()
            `;

            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Database error' });
    }
}
