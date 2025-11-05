const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../modals/userSchema');

const generateToken = (user) => 
  jwt.sign(
    { id: user._id, role: user.role }, 
    process.env.SECRET_JWT || 'default_secret', 
    { expiresIn: '7d' }
  );

module.exports.register = async (req) => {
  const { name, email, password, confirmPassword, phone, role, image } = req.body;

  if (!name || !email || !password || !confirmPassword || !phone) {
    return {
      error: true,
      msg: 'All fields required',
      code: 400
    };
  }

  if (password !== confirmPassword) {
    return {
      error: true,
      msg: 'Passwords do not match',
      code: 400
    };
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return {
      error: true,
      msg: 'User already exists',
      code: 400
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    role: role || 'user',
    image: image || null
  });

  const token = generateToken(user);

  return {
    error: false,
    data: { user, token },
    msg: 'User registered successfully',
    code: 201,
    status: 'SUCCESS'
  };
};
