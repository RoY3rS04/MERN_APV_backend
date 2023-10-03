import JWT from 'jsonwebtoken';
import Vet from '../models/Vet.js';

const checkAuth = async (req, res, next) => {
    
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {

            token = req.headers.authorization.split(' ')[1];
            
            const decoded = JWT.verify(token, process.env.JWT_SECRET);

            req.vet = await Vet.findById(decoded.id).select('-password -token -confirmed');

            return next();
        } catch (error) {
            const myError = new Error('Invalid token');

            return res.status(403).json({ msg: myError.message });
        }
    }

    if (!token) {
        const error = new Error('Invalid token or non-existent');

        return res.status(403).json({ msg: error.message });
    }

    next();
}

export default checkAuth;