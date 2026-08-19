const jwt = require("jsonwebtoken");

// =====================================================
// PROTECT
// Verifies the JWT sent in the Authorization header and
// attaches the decoded user id to req.user.
// Any route using this middleware can no longer be
// impersonated by passing an arbitrary userId in the
// request body/query — the id always comes from the
// verified token.
// =====================================================

const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, no token provided"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // decoded = { id: user._id, iat, exp }
        req.user = { id: decoded.id };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, invalid or expired token"
        });
    }
};

module.exports = { protect };
