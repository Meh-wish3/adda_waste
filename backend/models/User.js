const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['CITIZEN', 'COLLECTOR', 'ADMIN'],
        required: true,
    },
    // Role-specific fields
    householdId: {
        type: String,
        // Required for CITIZEN role
    },
    assignedWard: {
        type: String,
        // For COLLECTOR role
        default: 'Ward 4',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);
