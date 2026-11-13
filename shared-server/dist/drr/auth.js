import jwt from "jsonwebtoken";
const secret = () => process.env.JWT_SECRET || "dev-secret";
export function signToken(user) {
    return jwt.sign(user, secret(), { expiresIn: "12h" });
}
export function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
        return res.status(401).json({ message: "Authentication required" });
    }
    try {
        req.user = jwt.verify(token, secret());
        return next();
    }
    catch {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
export function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }
        if (req.user.role === "ADMIN" || roles.includes(req.user.role)) {
            return next();
        }
        return res.status(403).json({ message: "You do not have permission for this action" });
    };
}
