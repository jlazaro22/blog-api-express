import { Router } from 'express';

import deleteCurrentUser from 'src/controllers/v1/user/delete-current-user';
import deleteUserById from 'src/controllers/v1/user/delete-user-by-id';
import getAllUsers from 'src/controllers/v1/user/get-all-users';
import getCurrentUser from 'src/controllers/v1/user/get-current-user';
import getUserById from 'src/controllers/v1/user/get-user-by-id';
import updateCurrentUser from 'src/controllers/v1/user/update-current-user';
import authenticate from 'src/middlewares/authenticate';
import authorize from 'src/middlewares/authorize';
import {
  getAllUsersRequestValidation,
  getOrDeleteUserByIdRequestValidation,
  userUpdateRequestValidation,
} from 'src/middlewares/validations/user-validations';

const router: Router = Router();

router.get(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  getCurrentUser,
);

router.put(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  userUpdateRequestValidation,
  updateCurrentUser,
);

router.delete(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  deleteCurrentUser,
);

router.get(
  '/',
  authenticate,
  authorize(['admin']),
  getAllUsersRequestValidation,
  getAllUsers,
);

router.get(
  '/:userId',
  authenticate,
  authorize(['admin']),
  getOrDeleteUserByIdRequestValidation,
  getUserById,
);

router.delete(
  '/:userId',
  authenticate,
  authorize(['admin']),
  getOrDeleteUserByIdRequestValidation,
  deleteUserById,
);

export default router;
