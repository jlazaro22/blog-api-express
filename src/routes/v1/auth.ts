import { Router } from 'express';
import register from 'src/controllers/v1/auth/register';
import { userRegisterRequestValidation } from 'src/middlewares/validations/user-validations';

const router: Router = Router();

router.post('/register', userRegisterRequestValidation, register);

export default router;
