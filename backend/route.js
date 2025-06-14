import express from 'express';
import User from './model/user.js';
import validator from 'validator';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Signup API
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password
        });

        // Get JWT token
        const token = newUser.getJWTToken();

        // Set cookie options
        const cookieOptions = {
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
        };

        // Set cookie and send response
        res.cookie('token', token, cookieOptions).status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

// Login API
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide both email and password' 
            });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide a valid email address' 
            });
        }

        // Find user and select password field explicitly
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }

        // Verify password
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }

        // Get JWT token
        const token = user.getJWTToken();

        // Set cookie options
        const cookieOptions = {
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
        };

        // Remove password from response
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            appointment_history: user.appoitment_history
        };

        // Set cookie and send response
        res.cookie('token', token, cookieOptions).status(200).json({
            success: true,
            message: 'Login successful',
            user: userResponse
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error logging in', 
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Logout API
router.post('/logout', (req, res) => {
    res.cookie('token', '', {
        expires: new Date(0),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
    }).json({
        success: true,
        message: 'Logged out successfully'
    });
});

// Get user profile
router.get('/profile', async (req, res) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Please login to access this resource'
            });
        }

        // Verify token and get user
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                appointment_history: user.appoitment_history
            }
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Create Appointment API
router.post('/appointments', async (req, res) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Please login to create an appointment'
            });
        }

        // Verify token and get user
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const { name, disease, description } = req.body;

        // Input validation
        if (!name || !disease) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name and disease'
            });
        }

        // Create new appointment
        const newAppointment = {
            name,
            disease,
            description: description || '',
            status: 'pending',
            createdAt: new Date()
        };

        // Add appointment to user's appointment history
        if (!user.appoitment_history) {
            user.appoitment_history = [];
        }
        
        user.appoitment_history.push(newAppointment);
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
            appointment: newAppointment
        });
    } catch (error) {
        console.error('Create appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating appointment',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

export default router;
