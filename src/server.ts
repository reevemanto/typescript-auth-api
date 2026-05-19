import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorHandler from './_middleware/error-handler';
import db, { initialize } from './_helpers/db';
import accountsController from './accounts/accounts.controller';
import swaggerRouter from './_helpers/swagger';


const app: Application = express();
const PORT = process.env.PORT || 4000;


const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:4200';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(cookieParser());

app.use('/accounts', accountsController);
app.use('/api-docs', swaggerRouter);
app.use(errorHandler);

// Initialize database THEN start server
initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
        });
    })
    .catch((err: any) => {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    });