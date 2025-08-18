import pool from "@/lib/db";

export async function GET() {
    try {
      const client = await pool.connect();
      
  
      const res = await client.query('SELECT * FROM categories');
      client.release();
  
      return new Response(JSON.stringify(res.rows), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "error" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  