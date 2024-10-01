const jwt = require('jsonwebtoken');

const authentication = (req,res,next)=>{
    const authHeader = req.header('Authorization');

    if(!authHeader)
    {
        return res.status(401).json({message:'Acces Denied. No Token Provided.'})
    }

    const token = authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({ message: "Access Denied. Invalid token format." });
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(err){
        console.error('JWT verification failed:', err.message);
        return res.status(400).json({ message: 'Invalid token.' });
    }
}

module.exports = authentication;