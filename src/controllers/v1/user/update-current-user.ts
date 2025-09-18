import { Request, Response } from 'express';

import { logger } from 'src/lib/winston';
import User from 'src/models/user';

export default async function updateCurrentUser(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.userId;
  const {
    username,
    email,
    password,
    firstName,
    lastName,
    website,
    facebook,
    instagram,
    x,
    youtube,
    linkedin,
  } = req.body;

  try {
    const user = await User.findById(userId).select('+password -__v').exec();

    if (!user) {
      res.status(404).json({
        code: 'NotFoundError',
        message: 'User not found.',
      });

      return;
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (!user.socialLinks) user.socialLinks = {};
    if (website) user.socialLinks.website = website;
    if (facebook) user.socialLinks.facebook = facebook;
    if (instagram) user.socialLinks.instagram = instagram;
    if (x) user.socialLinks.x = x;
    if (youtube) user.socialLinks.youtube = youtube;
    if (linkedin) user.socialLinks.linkedin = linkedin;

    await user.save();
    logger.info('User updated successfully.', user);

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });

    logger.error('Error while updating the current user.', err);
  }
}
