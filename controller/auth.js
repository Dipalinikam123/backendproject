const bcrypt = require('bcrypt'); //for password
const jwt = require('jsonwebtoken'); //for token
const model = require('../model/user')
const ejs = require('ejs')
const path = require('path')

const User = model.User
const nodemailer = require("nodemailer");
const {
    USER_NOT_FOUND,
    LOGIN_SUCCESS,
    PASSWORD_INCORRECT,
    RESET_LINK_SEND,
    SERVER_ERROR,
    VERIFIED,
    NOT_VERIFIED,
    EXPIRE_LINK,
    PASSWORD_NOT_MATCH,
    RESET_PASSWORD_SUCCESS,
    TOKEN_VERIFICATION_FAIL
} = require('../utils/constant');


const secretKey = process.env.SECRET
const forgetPassUrl = process.env.FORGOT_PASS_URL || process.env.FORGOT_PASS_URL_LOCAL;
const nodeMailer = process.env.NODE_MAILER_EMAIL
const password = process.env.PASSWORD
const hostMail = process.env.HOST_MAIL

exports.createUser = async (req, res) => {
    // console.log("--new user", req.body)
    try {
        const user = new User(req.body);

        //hash password- bcrypt
        const hash = await bcrypt.hash(req.body.password, 10);
        user.password = hash;
        await user.save();

        const token = jwt.sign({ _id: user.id, email: user.email }, secretKey,);
        // Save the token to the user document and update the database
        user.token = token;
        await user.save();
        res.status(201).json({ success: true, token })
    } catch (error) {
        res.status(401).json({ success: false, message: error.message })
    }
}

exports.loginUser = async (req, res) => {
    // console.log("--login user", req.body)
    try {
        //check is email present or not in User
        const user = await User.findOne({ email: req.body.email }).exec();
        !user && res.status(401).json({ message: USER_NOT_FOUND })
        // console.log("---login user",user)
        //verify password - is user is same 
        const isAuth = bcrypt.compareSync(req.body.password, user.password);

        if (isAuth) {
            //generate token on login user
            const token = jwt.sign({ email: req.body.email, _id: user.id }, secretKey);
            user.token = token;
            await user.save();
            return res.json({ message: LOGIN_SUCCESS, token });
        }
        else {
            res.status(401).json({ message: PASSWORD_INCORRECT });
        }
    } catch (error) {
        res.status(401).json(error)
    }
}
exports.forgetPassword = async (req, res) => {

    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email });
        // console.log("--forgotpwd user", user);

        if (!user) return res.status(404).json({ message: USER_NOT_FOUND });

        const token = jwt.sign({ email: email, _id: user.id }, secretKey, { expiresIn: '1hr' });
        user.resetToken = token
        await user.save();
        const link = `${forgetPassUrl}/${user._id}/${token}`;
        console.log("---link", link);

        var transporter = nodemailer.createTransport({
            secure: true,
            host: hostMail,
            port: 465,
            auth: {
                user: nodeMailer,
                pass: password,
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

        return res.status(200).json({ message: RESET_LINK_SEND });
    } catch (error) {
        return res.status(500).json({ message: SERVER_ERROR });
    }
}

exports.verifyResetToken = async (req, res) => {
    const { id, token } = req.params;
    // console.log("---reset", id, token)
    try {
        const oldUser = await User.findOne({ _id: id });
        // console.log("---olduser", oldUser)

        if (!oldUser) {
            return res.status(404).json({ message: USER_NOT_FOUND });
        }
        const verify = jwt.verify(token, secretKey);

        ejs.renderFile(
            path.resolve(__dirname, '../views/index.ejs'),
            {
                email: verify.email,
                id: id,
                token: token
            }, // Pass the email to the template
            function (err, str) {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Error rendering the page.");
                }
                res.send(str); // Send the rendered HTML string
            }
        );

    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(400).send(NOT_VERIFIED);
    }
}

exports.resetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password, confirmPassword } = req.body;

    try {
        const user = await User.findOne({ _id: id });

        if (!user) return res.status(404).json({ message: USER_NOT_FOUND });

        const tokenVerify = jwt.verify(token, secretKey);

        if (user.resetToken !== token || !tokenVerify) {
            return res.status(400).json({ message: EXPIRE_LINK });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: PASSWORD_NOT_MATCH });
        }

        const hash = await bcrypt.hash(password, 10);

        await User.updateOne(
            { _id: id },
            { $set: { password: hash, resetToken: null } } 
        );

        // Respond with a success message
        return res.status(200).json({ message: RESET_PASSWORD_SUCCESS });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: TOKEN_VERIFICATION_FAIL });
    }
};
