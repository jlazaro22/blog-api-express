import { Router } from 'express';
import login from 'src/controllers/v1/auth/login';
import register from 'src/controllers/v1/auth/register';
import {
  userLoginRequestValidation,
  userRegisterRequestValidation,
} from 'src/middlewares/validations/user-validations';

const router: Router = Router();

router.post('/register', userRegisterRequestValidation, register);
router.post('/login', userLoginRequestValidation, login);

export default router;
