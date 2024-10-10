const model = require('../model/user')
const bcrypt = require('bcrypt'); //for password
const { GET_USER_FAIL,
  USER_NOT_FOUND,
  GET_USER_ID_FAIL,
  FAIL_UPDATE_USER,
  DELETE_USER_SUCCESS,
  FAIL_DELETE_USER,
  CURRENT_PWD_INCORRECT,
  UPDATE_PWD_SUCCESS,
  SERVER_ERROR
} = require('../utils/constant')
const User = model.User

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.status(200).json({ success: 'Ok', users })

  } catch (error) {
    res.status(500).json({ message: GET_USER_FAIL, error });
  }
}

exports.getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).exec();
    !user && res.json({ message: USER_NOT_FOUND })
    // console.log("--get res", user)
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: GET_USER_ID_FAIL, error });
    
  }
}
exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOneAndReplace({ _id: id }, req.body, { new: true })
    !user && res.json({ message: USER_NOT_FOUND })
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: FAIL_UPDATE_USER, error });
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id)
    !user && res.json({ message: USER_NOT_FOUND })
    res.json({ message: DELETE_USER_SUCCESS, user })
  } catch (error) {
    res.status(500).json({ message: FAIL_DELETE_USER, error });
  }
}


exports.profile = (req, res) => {
  // Access the user email from req.user.email
  const userId = req.user._id;

  // Fetch user profile from the database using userEmail and exclude the password field
  User.findById(userId)
    .select('-password') // Exclude the password field
    .then(user => {
      if (!user) return res.status(404).send('User not found');
      res.json(user); // Send the user data in the response, without the password
    })
    .catch(err => res.status(500).send('Server error')); // Handle errors
};

exports.updatePassword = async (req, res) => {
  const userId = req.user._id;
  // console.log("----id99999",userEmail)
  const { currentPassword, newPassword } = req.body; // Destructure current and new passwords

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: USER_NOT_FOUND });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: CURRENT_PWD_INCORRECT });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: UPDATE_PWD_SUCCESS });
  } catch (error) {
    res.status(500).json({ message: SERVER_ERROR, error });
  }
};