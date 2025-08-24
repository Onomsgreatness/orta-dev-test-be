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

export { getShifts };