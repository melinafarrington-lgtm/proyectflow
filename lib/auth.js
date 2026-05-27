const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'proyectflow-secret-key';

function getAuthUser(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try { return jwt.verify(authHeader.split(' ')[1], JWT_SECRET); } catch(e) { return null; }
}

function withAuth(handler, roles = []) {
  return (req, res) => {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    if (roles.length > 0 && !roles.includes(user.role)) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    return handler(req, res);
  };
}

module.exports = { withAuth, getAuthUser, JWT_SECRET };
