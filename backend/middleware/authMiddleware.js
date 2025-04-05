import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next(); // Must call next()
    } catch (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
};