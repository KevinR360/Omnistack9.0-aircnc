import User from '../models/User';

class SessionController {
  async store(req, res) {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      // eslint-disable-next-line no-const-assign
      user = await User.create({ email });
    }

    return res.json(user);
  }
}

export default new SessionController();
