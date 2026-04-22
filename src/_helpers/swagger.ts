import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';
import swaggerDocument from '../../swagger.json';

const router = Router();

// Swagger route
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument));

export default router;