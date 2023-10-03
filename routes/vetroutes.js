import express from 'express';
import {
    register,
    profile,
    confirmAcount,
    authenticate,
    forgetPassword,
    checkToken,
    newPassword,
    updateProfile,
    updatePassword
} from '../controllers/vetController.js'
import checkAuth from '../middleware/authMiddleware.js';

const vetRouter = express.Router();

vetRouter.post('/', register);

vetRouter.get('/confirm/:token', confirmAcount);

vetRouter.post('/login', authenticate);
vetRouter.post('/i-forgot-password', forgetPassword);
vetRouter.route('/i-forgot-password/:token').get(checkToken).post(newPassword);

vetRouter.get('/profile', checkAuth, profile);
vetRouter.put('/profile/:id', checkAuth, updateProfile);
vetRouter.put('/update-password', checkAuth, updatePassword)

export default vetRouter;