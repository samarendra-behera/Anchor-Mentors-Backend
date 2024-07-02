const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const user = require("../db/models/user");

const generateToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    return token;
}

const signup = async (req, res, next) => {
    const body = req.body

    if (!['mentor', 'mentee'].includes(body.userType)) {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid user Type'
        })
    }

    const newUser = await user.create({
        userType: body.userType,
        fullName: body.fullName,
        email: body.email,
        password: body.password,
        confirmPassword: body.confirmPassword
    })

    const result = newUser.toJSON()

    delete result.password
    delete result.deletedAt

    result.token = generateToken({
        id: result.id,
    });

    if (!result) {
        return res.status(400).json({
            status: 'fail',
            message: 'Failed to create the user',
        })
    }

    return res.status(201).json({
        status: 'success',
        data: result
    })
};


const login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide email and password'
        })
    }

    const result = await user.findOne({ where: { email } })
    
    if (!result || !(await bcrypt.compare(password, result.password))) {
        return res.status(400).json({
            status: 'fail',
            message: 'Incorrect email or password'
        })
    }

    const token = generateToken({
        id: result.id,
    });
    return res.json({
        status: 'success',
        token
    })
}

module.exports = { signup, login };