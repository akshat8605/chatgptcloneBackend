const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jwt-then");

exports.register = async (req, res) => {
  const { name, email } = req.body;
  const userExists = await User.findOne({
    email: email.toLowerCase(),
  });

  if (userExists) {
    const token = await jwt.sign({ id: userExists.id }, 'dskfjslkdjfm2');
    res.json({
      message: "User [" + name + "] logged in successfully!",
      user: {
        token,
        email: userExists.email.toLowerCase(),
        name: userExists.name
      }
    });
  }
  else {
    const user = new User({
      name,
      email: email.toLowerCase()
    });

    await user.save();
    const token = await jwt.sign({ id: user.id }, 'dskfjslkdjfm2');
    res.json({
      message: "User [" + name + "] registered successfully!",

      user: {
        token,
        email: user.email.toLowerCase(),
        name: user.name,
        id: user.id
      }
    });
  }
};

exports.login = async (req, res) => {
  const { email } = req.body;
  const userExists = await User.findOne({
    email: email.toLowerCase()
  });

  if (!userExists) throw "Email and Password did not match.";

  const token = await jwt.sign({ id: userExists.id }, 'dskfjslkdjfm2');
  res.json({
    message: "User logged in successfully!",

    user: {
      token,
      email: userExists.email.toLowerCase(),
      name: userExists.name,
      id: userExists["_id"]

    }
  });
};

exports.loginWithToken = async (req, res) => {
  const { token } = req.body
  try {
    const decoded = await jwt.verify(token, 'dskfjslkdjfm2');
    // console.log(decoded.id)
    if (decoded && decoded.id) {
      const userExists = await User.findOne({
        _id: decoded.id
      });
      //  console.log(userExists)
      res.json({
        message: "User logged in successfully!",
        user: {
          token,
          email: userExists.email.toLowerCase(),
          name: userExists.name,
          id: userExists["_id"]

        }
      });
    }
    else{
      return res.status(401).send("Invalid Token");
    }

  } catch (err) {
    // console.log(err)
    return res.status(401).send("Invalid Token");
  }

}