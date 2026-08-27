// باقي ال GameSession >> getProfile

const User = require("../models/User");
const GameSession = require("../models/GameSession");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (username) {
      user.username = username;
    }

    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.user.userId },
      });

      if (existingUser) {
        return res.status(409).json({
          message: "Email already exists",
        });
      }

      user.email = email;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        totalScore: user.totalScore,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.user.userId);

    res.json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getTopDetectives = async (req, res) => {
  try {
    // بنجيب أعلى 3 مستخدمين حسب totalScore تنازلياً
    const topDetectives = await User.find({})
      .select("username totalScore role")
      .sort({ totalScore: -1 })
      .limit(3);

    res.status(200).json(topDetectives);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching top detectives", error: error.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const leaderboard = await GameSession.find({ isCompleted: true })
      .populate("userId", "username email")
      .sort({ totalScore: -1, timeTakenSeconds: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      msg: "FETCH LEADERBOARD SUCCESSFULLY",
      data: leaderboard,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching leaderboard",
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
  getTopDetectives,
  getLeaderboard,
};
