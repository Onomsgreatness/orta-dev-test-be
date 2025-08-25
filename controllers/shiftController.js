import mongoose from "mongoose";
import Shift from "../models/shiftsModel.js";

const getShifts = async (req, res) => {
    try {
        const { userId } = req.query;
        const tokenUserId = req.user.id || req.user._id;

        if (!userId) {
            return res
                .status(400)
                .json({ message: "userId query parameter is required" });
        }

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ message: "Invalid userId" });
        }

        if (userId !== tokenUserId) {
            return res
                .status(403)
                .json({ message: "Forbidden: cannot fetch other users' shifts" });
        }

        const shifts = await Shift.find({ user: userId })
            .populate("user", "name email")
            .populate("location")
            .sort({ date: 1 });

        res.json(shifts);
    } catch (err) {
        console.error("Error fetching shifts:", err);
        res.status(500).json({ message: err.message });
    }
};


const createShift = async (req, res) => {
    try {
        const { 
            title, 
            role, 
            date, 
            startTime, 
            finishTime, 
            location, 
            user, 
            typeOfShift,
            numOfShiftsPerDay
        } = req.body;

        // Verify authenticated user matches the requested user
        const tokenUserId = req.user.id || req.user._id;
        if (user !== tokenUserId.toString()) {
            return res.status(403).json({
                message: "Forbidden: cannot create shifts for other users"
            });
        }

        // Validate required fields
        const requiredFields = ['title', 'role', 'date', 'startTime', 'finishTime', 'location', 'user'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Validate ObjectIds
        if (!mongoose.isValidObjectId(location) || !mongoose.isValidObjectId(user)) {
            return res.status(400).json({
                message: "Invalid location or user ID format"
            });
        }

        // Validate numOfShiftsPerDay
        const shiftsPerDay = parseInt(numOfShiftsPerDay) || 1;
        if (shiftsPerDay < 1 || shiftsPerDay > 24) {
            return res.status(400).json({
                message: "Number of shifts per day must be between 1 and 24"
            });
        }

        // Validate date format
        const shiftDate = new Date(date);
        if (isNaN(shiftDate.getTime())) {
            return res.status(400).json({
                message: "Invalid date format"
            });
        }

        // Create new shift
        const newShift = new Shift({
            title,
            role,
            date: shiftDate,
            startTime,
            finishTime,
            location,
            user,
            typeOfShift: typeOfShift || [],
            numOfShiftsPerDay: shiftsPerDay
        });

        // Save the shift
        const savedShift = await newShift.save();

        // Fetch the populated shift to return
        const populatedShift = await Shift.findById(savedShift._id)
            .populate("user", "name email")
            .populate("location");

        res.status(201).json(populatedShift);

    } catch (error) {
        console.error("Error creating shift:", error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation error",
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({
            message: "Error creating shift",
            error: error.message
        });
    }
};

const updateShift = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            title, 
            role, 
            date, 
            startTime, 
            finishTime, 
            location, 
            typeOfShift,
            numOfShiftsPerDay 
        } = req.body;

        // Validate shift ID
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid shift ID format"
            });
        }

        // Find existing shift
        const existingShift = await Shift.findById(id);
        if (!existingShift) {
            return res.status(404).json({
                message: "Shift not found"
            });
        }

        // Check authorization
        const tokenUserId = req.user.id || req.user._id;
        if (existingShift.user.toString() !== tokenUserId.toString()) {
            return res.status(403).json({
                message: "Forbidden: cannot update other users' shifts"
            });
        }

        // Validate date if provided
        let shiftDate;
        if (date) {
            shiftDate = new Date(date);
            if (isNaN(shiftDate.getTime())) {
                return res.status(400).json({
                    message: "Invalid date format"
                });
            }
        }

        // Validate numOfShiftsPerDay if provided
        if (numOfShiftsPerDay !== undefined) {
            const shiftsPerDay = parseInt(numOfShiftsPerDay);
            if (isNaN(shiftsPerDay) || shiftsPerDay < 1 || shiftsPerDay > 24) {
                return res.status(400).json({
                    message: "Number of shifts per day must be between 1 and 24"
                });
            }
        }

        // Validate location if provided
        if (location && !mongoose.isValidObjectId(location)) {
            return res.status(400).json({
                message: "Invalid location ID format"
            });
        }

        // Create update object with only provided fields
        const updateData = {
            ...(title && { title }),
            ...(role && { role }),
            ...(date && { date: shiftDate }),
            ...(startTime && { startTime }),
            ...(finishTime && { finishTime }),
            ...(location && { location }),
            ...(typeOfShift && { typeOfShift }),
            ...(numOfShiftsPerDay && { numOfShiftsPerDay: parseInt(numOfShiftsPerDay) })
        };

        // Update shift with new data
        const updatedShift = await Shift.findByIdAndUpdate(
            id,
            updateData,
            { 
                new: true, // Return updated document
                runValidators: true // Run model validations
            }
        ).populate("user", "name email")
         .populate("location");

        res.status(200).json(updatedShift);

    } catch (error) {
        console.error("Error updating shift:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation error",
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({
            message: "Error updating shift",
            error: error.message
        });
    }
};


const deleteShift = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId format
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid shift ID format"
            });
        }

        // Find shift and check if it exists
        const shift = await Shift.findById(id)
            .populate("user", "name email")
            .populate("location");

        if (!shift) {
            return res.status(404).json({
                message: "Shift not found"
            });
        }

        // Check if authenticated user owns the shift
        const tokenUserId = req.user.id || req.user._id;
        if (shift.user._id.toString() !== tokenUserId.toString()) {
            return res.status(403).json({
                message: "Forbidden: cannot delete other users' shifts"
            });
        }

        // Store shift details before deletion for response
        const deletedShift = await Shift.findByIdAndDelete(id)
            .populate("user", "name email")
            .populate("location");

        // Return success response with deleted shift details
        return res.status(200).json({
            message: "Shift deleted successfully",
            deletedShift
        });

    } catch (error) {
        console.error("Error deleting shift:", error);
        return res.status(500).json({
            message: "Error deleting shift",
            error: error.message
        });
    }
};


export { getShifts, createShift , updateShift, deleteShift};