const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

// Register new user
async function register(req, res, next) {
    try {
        const { email, password, name, role, householdId } = req.body;

        // Validation
        if (!email || !password || !name || !role) {
            return res.status(400).json({
                message: 'Email, password, name, and role are required'
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Validate role-specific requirements
        if (role === 'CITIZEN' && !householdId) {
            return res.status(400).json({
                message: 'Household ID is required for citizen registration'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            email,
            password: hashedPassword,
            name,
            role,
            householdId: role === 'CITIZEN' ? householdId : undefined,
            assignedWard: role === 'COLLECTOR' ? 'Ward 4' : undefined,
        });

        // Generate token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                householdId: user.householdId,
            },
        });
    } catch (err) {
        next(err);
    }
}

// Login user
async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                householdId: user.householdId,
                assignedWard: user.assignedWard,
            },
        });
    } catch (err) {
        next(err);
    }
}

// Get current user
async function me(req, res, next) {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            householdId: user.householdId,
            assignedWard: user.assignedWard,
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    register,
    login,
    me,
};
