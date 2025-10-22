// public/js/db.js
export async function runQuery(sql) {
  try {
    const res = await fetch('/api/my_sql/get-SqlQuery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql })
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    return await res.json();  // rows from DB
  } catch (err) {
    console.error('Query failed:', err);
    return [];
  }
}
