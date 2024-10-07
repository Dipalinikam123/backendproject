const bcrypt = require('bcrypt'); //for password
const jwt = require('jsonwebtoken'); //for token
const model = require('../model/user')
const User = model.User
const nodemailer = require("nodemailer");
require('dotenv').config();


// const privateKey = process.env.PRIVATE_KEY
// const publicKey = process.env.PRIVATE_KEY

const secretKey = process.env.SECRET

exports.createUser = async (req, res) => {
    console.log("--new user", req.body)
    try {
        const user = new User(req.body);
        //generate token on new user
        const token = jwt.sign({ email: req.body.email }, secretKey);
        //sending token
        user.token = token

        //hash password- bcrypt
        const hash = await bcrypt.hash(req.body.password, 10);
        user.password = hash;

        await user.save();
        res.status(201).json({ success: true })
    } catch (error) {
        res.status(401).json({ success: false, message: error.message })
    }
}

exports.loginUser = async (req, res) => {
    console.log("--login user", req.body)
    try {
        //check is email present or not in User
        const user = await User.findOne({ email: req.body.email }).exec();
        !user && res.status(401).json({ message: "User Not Found" })
        // console.log("---login user",user)
        //verify password - is user is same 
        const isAuth = bcrypt.compareSync(req.body.password, user.password);

        if (isAuth) {
            //generate token on login user
            const token = jwt.sign({ email: req.body.email }, secretKey);
            user.token = token;
            await user.save();
            return res.json({ message: 'Login SuccessFully', token });
        }
        else {
            res.status(401).json({ message: 'password incorrect.' });
        }
    } catch (error) {
        res.status(401).json(error)
    }
}
exports.forgetPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email });
        console.log("--forgotpwd user", user);

        if (!user) return res.status(404).json("User Not Found");

        const token = jwt.sign({ email: email, _id: user.id }, secretKey, { expiresIn: '1m' });
        user.resetToken=token
        await user.save();
        const link = `http://localhost:5000/auth/reset-password/${user._id}/${token}`;
        console.log("---link", link);

        var transporter = nodemailer.createTransport({
            secure: true,
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: 'dipsnikam0108@gmail.com',
                pass: 'qjeruayljztejqot'
            }
        });

        function sendMail(to, sub, msg) {
            transporter.sendMail({
                to: to,
                subject: sub,
                html: msg
            })
        }
        sendMail(user.email, "Reset Password", link)

        return res.status(200).json("Password reset link sent to your email.");
    } catch (error) {
        console.error(error);
        return res.status(500).json("Internal Server Error");
    }
}

exports.verifyResetToken = async (req, res) => {
    const { id, token } = req.params
    // console.log("---reset", id, token)
    try {
        const oldUser = await User.findOne({ _id: id })
        // console.log("---olduser",oldUser)
        !oldUser && res.json({ status: "User Not Exist" })
        const verify = jwt.verify(token, secretKey)
        res.send("Verified")

    } catch (error) {
        res.send('Not Verified')
    }
}

// exports.resetPassword = async (req, res) => {
//     let { id, token } = req.params;
//     // console.log({id, token})
//     const { password, confirmPassword } = req.body;
//     if (token === null) return res.json("link is expired..")
//     try {
//         const user = await User.findOne({ _id: id });
//         if (!user) return res.status(404).json({ message: "User Not Exist" });

//         jwt.verify(token, secretKey);

//         if (password !== confirmPassword) {
//             return res.status(400).json({ message: "Passwords do not match" });
//         }



//         const hash = await bcrypt.hash(password, 10);
//         user.password = hash;
//         token = null
//         await user.save();

//         return res.status(200).json({ message: "Password successfully reset" });
//     } catch (error) {
//         console.error(error);
//         return res.status(400).json({ message: "Not Verified or Error occurred" });
//     }
// }

exports.resetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password, confirmPassword } = req.body;

    try {
        const user = await User.findOne({ _id: id });

        if (!user) return res.status(404).json({ message: "User Not Exist" });

        const tokenVerify=jwt.verify(token, secretKey);
        console.log("----jwtToken---",tokenVerify) 

        if (user.resetToken !== token || !tokenVerify) {
            console.log("====usertoken=",user.resetToken)
            console.log("=====token",token)
            return res.status(400).json({ message: "Invalid or expired reset link" });
        }

        

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const hash = await bcrypt.hash(password, 10);
        user.password = hash;

        user.resetToken = null;
        await user.save();

        return res.status(200).json({ message: "Password successfully reset" });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Token verification failed or an error occurred" });
    }
};
