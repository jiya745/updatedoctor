import express from 'express';
import User from './model/user.js';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Feedback from './model/feedback.js';

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
                email: newUser.email,
                appointment_history: newUser.appoitment_history,
                role: newUser.role
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
            appointment_history: user.appoitment_history,
            role: user.role
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
                appointment_history: user.appoitment_history,
                role: user.role
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
            createdAt: new Date(),
            uuid: crypto.randomUUID()
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

// Forgot Password API
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Please provide your email address' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found with this email' });
        }
        // Generate reset token
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });
        // In production, send email with this link
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
        console.log(resetUrl)
        res.status(200).json({ success: true, message: 'Password reset link generated', resetUrl });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error generating password reset link', error: error.message });
    }
});

// Reset Password API
router.post('/reset-password/:token', async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired password reset token' });
        }
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ success: false, message: 'Please provide a new password' });
        }
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error resetting password', error: error.message });
    }
});


// Feedback API
router.post('/feedback', async (req, res) => {
    try {
        const { feedback } = req.body;
        const token = req.cookies.token;
        
        if (!feedback || !feedback.trim()) {
            return res.status(400).json({ success: false, message: 'Feedback is required' });
        }

        let userId;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded._id;
        }

        const newFeedback = await Feedback.create({
            feedback,
            userId: userId || null
        });

        res.status(201).json({ 
            success: true, 
            message: 'Feedback submitted successfully',
            feedback: newFeedback
        });
    } catch (error) {
        console.error('Feedback submission error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error submitting feedback', 
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Admin API endpoints
// Get admin statistics
router.get('/admin/stats', async (req, res) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Please login to access admin resources'
            });
        }

        // Verify token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get total users count
        const totalUsers = await User.countDocuments();
        
        // Get total appointments (sessions) count
        const usersWithAppointments = await User.find({ 
            'appoitment_history.0': { $exists: true } 
        });
        
        const totalSessions = usersWithAppointments.reduce((total, user) => {
            return total + (user.appoitment_history ? user.appoitment_history.length : 0);
        }, 0);

        const totalFeedback = await Feedback.countDocuments();
        const activeSessions = usersWithAppointments.reduce((total, user) => {
            return total + (user.appoitment_history ? user.appoitment_history.filter(appointment => appointment.isActive).length : 0);
        }, 0);

        // Get users by month for chart data (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const usersByMonth = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        // Get session/appointment data by month
        const sessionsByMonth = await User.aggregate([
            { $unwind: "$appoitment_history" },
            {
                $match: {
                    "appoitment_history.createdAt": { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$appoitment_history.createdAt" },
                        month: { $month: "$appoitment_history.createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        // Get recent activity (last 10 users)
        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('name email createdAt');

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalSessions,
                usersByMonth,
                sessionsByMonth,
                recentUsers,
                totalFeedback,
                activeSessions
            }
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching admin statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get all users (admin only)
router.get('/admin/users', async (req, res) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Please login to access admin resources'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select('-password -resetPasswordToken')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalUsers = await User.countDocuments();

        res.status(200).json({
            success: true,
            users,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalUsers / limit),
                totalUsers,
                hasNext: page < Math.ceil(totalUsers / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Admin users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get all feedback (admin only)
router.get('/admin/feedback', async (req, res) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Please login to access admin resources'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const search = req.query.search;
        const skip = (page - 1) * limit;

        // Build query
        let query = {};
        if (status && status !== 'all') {
            query.status = status;
        }
        if (search) {
            query.feedback = { $regex: search, $options: 'i' };
        }

        const feedback = await Feedback.find(query)
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalFeedback = await Feedback.countDocuments(query);

        res.status(200).json({
            success: true,
            feedback,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalFeedback / limit),
                totalFeedback,
                hasNext: page < Math.ceil(totalFeedback / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Admin feedback error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching feedback',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Update feedback status (admin only)
router.patch('/admin/feedback/:id', async (req, res) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Please login to access admin resources'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const { status } = req.body;
        const feedbackId = req.params.id;

        if (!['pending', 'reviewed', 'resolved'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be pending, reviewed, or resolved'
            });
        }

        const feedback = await Feedback.findByIdAndUpdate(
            feedbackId,
            { status },
            { new: true, runValidators: true }
        ).populate('userId', 'name email');

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Feedback status updated successfully',
            feedback
        });
    } catch (error) {
        console.error('Update feedback error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating feedback',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get all sessions (admin only)
router.get('/admin/sessions', async (req, res) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Please login to access admin resources'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const search = req.query.search;
        const skip = (page - 1) * limit;

        // Get users with appointments
        let matchStage = {};
        if (status === 'active') {
            matchStage['appoitment_history.isActive'] = true;
        } else if (status === 'inactive') {
            matchStage['appoitment_history.isActive'] = false;
        }

        const pipeline = [
            { $unwind: "$appoitment_history" },
            { $match: matchStage },
            {
                $addFields: {
                    'appoitment_history.userId': '$_id',
                    'appoitment_history.userName': '$name',
                    'appoitment_history.userEmail': '$email'
                }
            },
            { $replaceRoot: { newRoot: "$appoitment_history" } }
        ];

        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { userName: { $regex: search, $options: 'i' } },
                        { disease: { $regex: search, $options: 'i' } },
                        {email: { $regex: search, $options: 'i' }}
                    ]
                }
            });
        }

        pipeline.push(
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit }
        );

        const sessions = await User.aggregate(pipeline);

        // Get total count
        const countPipeline = [
            { $unwind: "$appoitment_history" },
            { $match: matchStage }
        ];

        if (search) {
            countPipeline.push({
                $match: {
                    $or: [
                        { 'appoitment_history.name': { $regex: search, $options: 'i' } },
                        { name: { $regex: search, $options: 'i' } },
                        { 'appoitment_history.disease': { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } }
                    ]
                }
            });
        }

        countPipeline.push({ $count: "total" });
        const countResult = await User.aggregate(countPipeline);
        const totalSessions = countResult.length > 0 ? countResult[0].total : 0;

        res.status(200).json({
            success: true,
            sessions,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalSessions / limit),
                totalSessions,
                hasNext: page < Math.ceil(totalSessions / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Admin sessions error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching sessions',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});





// Update session status (admin only)
router.patch('/admin/sessions/:userId/:sessionId', async (req, res) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Please login to access admin resources'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const adminUser = await User.findById(decoded._id);

        if (!adminUser) {
            return res.status(404).json({
                success: false,
                message: 'Admin user not found'
            });
        }

        const { isActive } = req.body;
        const { userId, sessionId } = req.params;

        const user = await User.findOneAndUpdate(
            { 
                '_id': userId,
                'appoitment_history._id': sessionId
            },
            { 
                '$set': { 'appoitment_history.$.isActive': isActive }
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Session status updated successfully'
        });
    } catch (error) {
        console.error('Update session error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating session',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Update user status (admin only) - for activating/deactivating users
router.patch('/admin/users/:id', async (req, res) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Please login to access admin resources'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const adminUser = await User.findById(decoded._id);

        if (!adminUser) {
            return res.status(404).json({
                success: false,
                message: 'Admin user not found'
            });
        }

        const { isActive } = req.body;
        const userId = req.params.id;

        // Prevent admin from deactivating themselves
        if (userId === adminUser._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot modify your own account status'
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { isActive: isActive },
            { new: true, runValidators: true }
        ).select('-password -resetPasswordToken');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User status updated successfully',
            user
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get user details with appointments (admin only)
router.get('/admin/users/:id', async (req, res) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Please login to access admin resources'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const adminUser = await User.findById(decoded._id);

        if (!adminUser) {
            return res.status(404).json({
                success: false,
                message: 'Admin user not found'
            });
        }

        const userId = req.params.id;
        const user = await User.findById(userId).select('-password -resetPasswordToken');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get user's feedback
        const userFeedback = await Feedback.find({ userId: userId })
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({
            success: true,
            user,
            feedback: userFeedback,
            stats: {
                totalAppointments: user.appoitment_history ? user.appoitment_history.length : 0,
                activeAppointments: user.appoitment_history ? user.appoitment_history.filter(a => a.isActive).length : 0,
                totalFeedback: userFeedback.length
            }
        });
    } catch (error) {
        console.error('Get user details error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user details',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

export default router;
