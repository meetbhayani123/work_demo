import mongoose, { Schema, model, models } from 'mongoose';

const AuthCodeSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    codeChallenge: {
        type: String,
        required: true,
    },
    codeChallengeMethod: {
        type: String,
        required: true,
        default: 'S256',
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600, // Document expires after 10 minutes automatically
    },
});

export default models.AuthCode || model('AuthCode', AuthCodeSchema);
