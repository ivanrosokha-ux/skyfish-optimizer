import { users } from '../data/mockDb.js';

export function login(req, res) {
  const { email, password } = req.body;

  if (!email || !email.includes('@')) {
    return res
      .status(400)
      .json({ success: false, error: 'Введіть коректну адресу електронної пошти' });
  }

  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ success: false, error: 'Пароль повинен містити щонайменше 6 символів' });
  }

  let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    // Auto-create user for demo convenience if doesn't exist
    user = {
      id: `usr_${Date.now()}`,
      email: email.toLowerCase(),
      password,
      name: email.split('@')[0],
      token: `skyfish_jwt_${Date.now()}_${Math.random().toString(36).substring(2)}`,
    };
    users.push(user);
  }

  return res.json({
    success: true,
    token: user.token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });
}

export function register(req, res) {
  return login(req, res);
}

export function getMe(req, res) {
  return res.json({
    success: true,
    user: req.user,
  });
}
