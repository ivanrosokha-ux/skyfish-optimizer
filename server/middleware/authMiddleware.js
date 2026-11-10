import { users } from '../data/mockDb.js';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: 'Потрібна авторизація (відсутній токен)' });
  }

  const user = users.find((u) => u.token === token);
  if (!user && !token.startsWith('skyfish_jwt_')) {
    return res.status(403).json({ success: false, error: 'Недійсний або застарілий токен' });
  }

  req.user = user || { id: 'usr_guest', email: 'guest@example.com' };
  next();
}
