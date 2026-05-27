const db = require('../../../lib/db');
const { withAuth } = require('../../../lib/auth');

function handler(req, res) {
  const { id } = req.query;
  if (!['master', 'full', 'admin'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  if (req.method === 'PUT') {
    const { status, paid_date, notes, amount, due_date } = req.body;
    try {
      const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(id);
      if (!payment) return res.status(404).json({ error: 'Payment not found' });
      db.prepare('UPDATE payments SET status = ?, paid_date = ?, notes = ?, amount = ?, due_date = ? WHERE id = ?').run(status || payment.status, paid_date !== undefined ? paid_date : payment.paid_date, notes !== undefined ? notes : payment.notes, amount !== undefined ? amount : payment.amount, due_date !== undefined ? due_date : payment.due_date, id);
      return res.status(200).json({ message: 'Payment updated' });
    } catch (err) { return res.status(500).json({ error: 'Internal server error' }); }
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
export default withAuth(handler);
