const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) => 
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.SECRET_JWT || 'default_secret',
    { expiresIn: '7d' }
  );

module.exports.googleSignIn = async (req) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, googleId, role: 'user' });
    }

    const userToken = generateToken(user);

    return {
      data: { user, token: userToken },
      msg: 'User signed in successfully',
      code: 200,
      status: 'SUCCESS',
    };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      msg: error.message || 'Google sign-in failed',
      code: 500,
      status: 'FAILED',
    };
  }
};
