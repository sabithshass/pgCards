const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../modals/userSchema");
const crypto = require('crypto');
const sendEmail = require('../utils/mailer');

const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.SECRET_JWT || "default_secret",
    { expiresIn: "7d" }
  );

module.exports.register = async (req) => {
  const { name, email, password, confirmPassword, phone, role, image } =
    req.body;

  if (!name || !email || !password || !confirmPassword || !phone) {
    return {
      error: true,
      msg: "All fields required",
      code: 400,
    };
  }

  if (password !== confirmPassword) {
    return {
      error: true,
      msg: "Passwords do not match",
      code: 400,
    };
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return {
      error: true,
      msg: "email is already registered",
      code: 400,
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
   await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    role: role || "user",
    image: image || null,
  });

  // const token = generateToken(user);
    const user = await User.findOne(
    { email },
    {
      _id: 1,
      name: 1,
      email: 1,
      phone: 1,
      createdAt: 1,
    }
  );
  const token = generateToken(user);
  return {
    error: false,
    data: { user, token },
    msg: "User registered successfully",
    code: 201,
    status: "SUCCESS",
  };
};

module.exports.login = async (req) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return {
      error: true,
      msg: "Email and password are required",
      code: 400,
    };
  }

  const user = await User.findOne({ email });
  if (!user) {
    return {
      error: true,
      msg: "Invalid email or password",
      code: 401,
    };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return {
      error: true,
      msg: "Invalid email or password",
      code: 401,
    };
  }

  const token = generateToken(user);

    const data = await User.findOne(
    { email },
    {
      _id: 1,
      name: 1,
      email: 1,
      phone: 1,
      createdAt: 1,
    }
  );

  return {
    error: false,
    data: { data, token },
    msg: "Login successful",
    code: 200,
    status: "SUCCESS",
  };
};


module.exports.forgotPassword = async (req) => {
  const { email } = req.body;
  if (!email) {
    return { msg: 'Email is required', code: 400 };
  }
    

  const user = await User.findOne({ email });
  if (!user) {
    return { msg: 'No user found with this email', code: 404 };
  }
    

  const resetToken = crypto.randomBytes(32).toString('hex');
   const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
   console.log("resetToken",resetToken);
   console.log("hashedToken",hashedToken);
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 3600000; 
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await sendEmail({
    to: email,
    subject: 'Reset Your Password',
    templateName: 'forgotPassword',
    context: { name: user.name, resetLink }
  });

  return { msg: 'Password reset link sent to email',code:200  };
};


module.exports.resetPassword = async (req, res) => {
  
  const { token, newPassword, confirmPassword } = req.body;
  
  if (!token || !newPassword || !confirmPassword) {
    return {
      data: false,
      msg: 'Token and passwords are required',
      code: 400,
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      data: false,
      msg: 'Passwords do not match',
      code: 400,
    };
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return {
      data: false,
      msg: 'Invalid or expired token',
      code: 404,
    };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return {
    msg: 'Password reset successful. You can now log in.',
    code: 200,
  };
};
