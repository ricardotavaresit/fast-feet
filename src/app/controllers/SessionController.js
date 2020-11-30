const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();
const Yup = require('yup');

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!(await user.checkPasswork(password))) {
      return res.status(401).json({ error: 'Password does not match!' });
    }

    const { id, name } = user;
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, `${process.env.SECRET_OR_PRIVATE_KEY}`, {
        expiresIn: `${process.env.EXPIRES_IN}`,
      }),
    });
  }
}

module.exports = new SessionController();
