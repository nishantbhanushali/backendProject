import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    watchHistory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
    },
    username: {
        type: String,
        required: true,
        lowercase: true,
        index: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    coverimage: {
        type: String,
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password must be at least 6 characters"],
    },
    refreshtoken: {
        type: String,
    },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m',
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d',
        }
    );
};

export const User = mongoose.model("User", userSchema);
