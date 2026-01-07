import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        maxlength: [60, 'Email cannot be more than 60 characters'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default models.User || model('User', UserSchema);
