if (!process.env.SECRET_JWT) {
  throw new Error("❌ SECRET_JWT is not defined in Vercel Environment Variables");
}

module.exports = {
  jwtSecret: process.env.SECRET_JWT,
};
