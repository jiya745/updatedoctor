import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import validator from 'validator';
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: undefined
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validation: validator.isEmail
    },
    password: {
        type: String,
        required: true,
        default: undefined
    },
    appoitment_history: [
        {
            name: {type: String,default: undefined},
            disease: {type: String,default: undefined},
            description: {type: String,default: undefined},
            chats: [
                {
                    role: {type: String,enum: ["doctor","patience"]},
                    content: {type: String,default: undefined}
                }
            ]
        }
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: '15d'
    });
};

// Generate and hash password reset token
userSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token expire time (15 minutes)
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;
