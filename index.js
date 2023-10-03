import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import vetRouter from './routes/vetroutes.js';
import patientRouter from './routes/patientRoutes.js';

const app = express();
app.use(express.json())

dotenv.config();

connectDB();

const permitedDomains = [
    process.env.FRONTEND_URL
];

const corsOptions = {
    origin: function (origin, cb) {
        if (permitedDomains.indexOf(origin) !== -1) {
            cb(null, true);
        } else {
            cb(new Error('Not allowed by CORS'))
        }
    }
}

app.use(cors(corsOptions));

app.use('/api/vets', vetRouter)
app.use('/api/patients', patientRouter)

const PORT = process.env.PORT ?? 4000;

app.listen(PORT, () => {
    console.log('server working on port ' + PORT)
})