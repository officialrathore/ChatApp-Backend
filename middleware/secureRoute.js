import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const secureRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        console.log("✅ Cookies:", req.cookies);
        if (!token) {
            return res.status(401).json({ error: 'No token found, Unauthorized access' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🔓 Decoded JWT:", decoded);
        if (!decoded) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({ error: 'No user found' });
        }
        req.user = user;
        next();

    } catch (error) {
        console.log("Error in secureRoute middleware:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
export default secureRoute;