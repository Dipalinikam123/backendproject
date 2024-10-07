
const model= require('../model/user')
const bcrypt = require('bcrypt'); //for password

const User= model.User

  exports.getUsers= async (req, res) => {
    try {
      const user = await User.find()
      res.status(200).json({success:'Ok',user})
      
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve users.', error });
      console.log({error})
    }
  }

  exports.getUser= async(req,res)=>{
    try {
      const id = req.params.id;
      const user= await User.findById(id).exec();
      res.json(user)
      console.log("--get res",user)
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve user by ID.', error });
      console.log({error})
    }
  }
  exports.updateUser=async (req, res) => {
    try {
      const id = req.params.id;
      const user = await User.findOneAndReplace({ _id: id }, req.body, { new: true })
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json({ message: 'Failed to update user.', error });
    }
  } 

  exports.deleteUser=async (req, res) => {
    try {
      const id = req.params.id;
      const user = await User.findByIdAndDelete(id)
      res.json({message:"User Delete SUccesfully", user})
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete user.', error });
    }
  }

  exports.updatePassword = async (req, res) => {
    const userId = req.params.id; 
    const { currentPassword, newPassword } = req.body; // Destructure current and new passwords

    try {
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect.' });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.', error });
    }
};