const jwt = require('jsonwebtoken'); //for token
const secretKey = process.env.SECRET

// console.log('Secret Key:', secretKey); // Debugging line

//middleware
//verification- is user Register or not 
const auth = (req, res, next) => {
    try {
        const tokenCheck = req.get('Authorization');
        if (!tokenCheck) {
            return res.status(401).json({ error: "Token not found" });
        }

        const token = tokenCheck.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ error: "Token format is invalid" });
        }

        const decoded = jwt.verify(token, secretKey);
        // console.log("----req--",decoded)

        if (decoded.email) {
            req.user = decoded;
            // console.log("------reeq",req.user)
            next();
        } else {
            return res.status(401).json({ error: "Invalid token data" });
        }
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Invalid token" });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token expired" });
        }

        // Fallback error response
        res.status(500).json({ error: "Authentication failed" });
    }
}
exports.authMiddleware = auth