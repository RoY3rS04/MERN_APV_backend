import express from 'express';
import {
    addPatient,
    getPatients,
    getPatient,
    updatePatient,
    deletePatient
} from '../controllers/patientController.js';
import checkAuth from '../middleware/authMiddleware.js';

const patientRouter = express.Router();

patientRouter.route('/')
    .post(checkAuth, addPatient)
    .get(checkAuth, getPatients);

patientRouter.route('/:id')
    .get(checkAuth, getPatient)
    .put(checkAuth, updatePatient)
    .delete(checkAuth, deletePatient);

export default patientRouter;