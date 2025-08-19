import pool from "@/lib/db";

export async function GET() {
  try {
    const client = await pool.connect();

    const res = await client.query(
      "SELECT u.id, u.username, u.password, r.name as role FROM users u JOIN roles r ON u.role_id = r.id",
    );
    client.release();

    return new Response(JSON.stringify(res.rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
