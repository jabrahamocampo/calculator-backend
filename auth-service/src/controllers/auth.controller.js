import { registerUser, loginUser } from '../services/auth.service.js';

export async function register(req, res) {
  const { username, password } = req.body;
  try {
    const user = await registerUser(username, password);
    res.status(201).json({ message: 'User Registered', user: { id: user.id, username: user.username } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function login(req, res) {
  const { username, password } = req.body;
  try {
    const { token } = await loginUser(username, password);
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}
