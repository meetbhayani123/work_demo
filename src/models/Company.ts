import mongoose, { Schema, model, models } from 'mongoose';

const CompanySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a company name'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    code: {
        type: String,
        required: [true, 'Please provide a company code'],
        unique: true,
        maxlength: [20, 'Code cannot be more than 20 characters'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default models.Company || model('Company', CompanySchema);
