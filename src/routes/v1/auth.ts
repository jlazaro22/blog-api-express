import { Router } from 'express';
import login from 'src/controllers/v1/auth/login';
import refreshToken from 'src/controllers/v1/auth/refresh-token';
import register from 'src/controllers/v1/auth/register';
import {
  userLoginRequestValidation,
  userRefreshTokenRequestValidation,
  userRegisterRequestValidation,
} from 'src/middlewares/validations/user-validations';

const router: Router = Router();

router.post('/register', userRegisterRequestValidation, register);
router.post('/login', userLoginRequestValidation, login);
router.post('/refresh-token', userRefreshTokenRequestValidation, refreshToken);

export default router;
