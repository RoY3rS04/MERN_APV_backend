import JWT from 'jsonwebtoken';

const generateJWT = (id) => {
    return JWT.sign({
        id
    }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
}

export default generateJWT;