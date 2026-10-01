const { User } = require('../models');

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check demo credentials or database user
    const user = await User.findOne({ email: cleanEmail });

    if (!user || user.password !== password) {
      // Allow demo user directly as specified in requirements
      if (cleanEmail === 'admin@gmail.com' && password === 'admin123') {
        return res.status(200).json({
          success: true,
          message: 'Login successful',
          user: {
            email: 'admin@gmail.com',
            role: 'Administrator',
          },
          token: 'demo-fsd-jwt-token',
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        role: 'Administrator',
      },
      token: 'demo-fsd-jwt-token',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { login };
