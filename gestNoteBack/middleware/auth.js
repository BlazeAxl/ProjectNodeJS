const jwt = require('jsonwebtoken');
const util = require('../utils/utils');
const db = require('../config/bd'); // Assuming you have a db connection file

 // It's best to store this in an environment variable

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({
                success:false,
                error:"Authorization header missing"
            });
        }

        const token = authHeader.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success:false,
                error:"Token missing"
            })
        }

        const decoded_token = jwt.verify(token, process.env.KEY); // Use the key here

        const user = await util.GetUser( decoded_token.email );

        if (!user) {
            return res.status(401).json({
                success:false,
                error:"Invalid User"
            }); // Or "User not found", depending on your security needs
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error); // Log the error for debugging
        return res.status(401).json({
            success:false,
            error:"Authentication Failed"
        }); // More generic message for security reasons
    }
};

module.exports = authenticateToken
