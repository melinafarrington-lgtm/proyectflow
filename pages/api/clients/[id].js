const db = require('../../../lib/db');
const { withAuth } = require('../../../lib/auth');

function handler(req, res) {
  const { id } = req.query;
  if (req.method === 'GET') {
    const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    client.projects = db.prepare('SELECT * FROM projects WHERE client_id = ?').all(id);
    return res.status(200).json(client);
  }
  if (req.method === 'PUT') {
    const { name, email, phone, company, notes } = req.body;
    try {
      const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(id);
      if (!client) return res.status(404).json({ error: 'Client not found' });
      db.prepare('UPDATE clients SET name = ?, email = ?, phone = ?, company = ?, notes = ? WHERE id = ?').run(name || client.name, email || client.email, phone || client.phone, company || client.company, notes !== undefined ? notes : client.notes, id);
      return res.status(200).json({ message: 'Client updated' });
    } catch (err) { return res.status(500).json({ error: 'Internal server error' }); }
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
export default withAuth(handler);
