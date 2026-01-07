`import mongoose, { Schema, model, models } from 'mongoose';

const RefreshTokenSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    revoked: {
        type: Date,
    },
    replacedByToken: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 7 * 24 * 60 * 60, // Document expires after 7 days automatically (assuming standard refresh token lifetime of < 7 days)
    },
});

RefreshTokenSchema.virtual('isExpired').get(function () {
    return Date.now() >= this.expiresAt.getTime();
});

RefreshTokenSchema.virtual('isActive').get(function () {
    return !this.revoked && !this.isExpired;
});

export default models.RefreshToken || model('RefreshToken', RefreshTokenSchema);
