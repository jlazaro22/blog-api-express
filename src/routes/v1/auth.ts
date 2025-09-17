import { Router } from 'express';

import login from 'src/controllers/v1/auth/login';
import logout from 'src/controllers/v1/auth/logout';
import refreshToken from 'src/controllers/v1/auth/refresh-token';
import register from 'src/controllers/v1/auth/register';
import authenticate from 'src/middlewares/authenticate';
import {
  loginRequestValidation,
  refreshTokenRequestValidation,
  registerRequestValidation,
} from 'src/middlewares/validations/auth-validations';

const router: Router = Router();

router.post('/register', registerRequestValidation, register);
router.post('/login', loginRequestValidation, login);
router.post('/refresh-token', refreshTokenRequestValidation, refreshToken);
router.post('/logout', authenticate, logout);

export default router;
