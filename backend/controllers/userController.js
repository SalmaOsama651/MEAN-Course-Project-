const User = require("../models/User");
const Case = require("../models/case");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-password")
      .populate("solvedCases");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const rank =
      (await User.countDocuments({
        totalScore: {
          $gt: user.totalScore,
        },
      })) + 1;

    res.status(200).json({
      message: "Profile retrieved successfully",
      profile: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        totalScore: user.totalScore,
        rank: rank,
        solvedCases: user.solvedCases,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
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

module.exports = { getProfile, updateProfile, deleteProfile };
