const jwt = require('jsonwebtoken');
const User  = require('../Models/User'); // Adjust path to import your User model

const authentication = async (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'Access Denied. No Token Provided.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. Invalid token format.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Find the user in the database
        const user = await User.findByPk(decoded.userId);
        console.log(user)

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if the token in the database matches the provided token
        if (user.token !== token) {
            return res.status(401).json({ message: 'Access Denied. Invalid or expired token.' });
        }

        // Attach the decoded user info and token to the request
        req.user = { ...decoded, token };
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error('JWT verification failed:', err.message);
        return res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = authentication;
