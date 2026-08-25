const mongoose = require("mongoose");
const gameSessionModel = require("../models/GameSession.js");

const getLeaderboard = async () => {
    return await gameSessionModel.aggregate([
        {
            $match: {
                isCompleted: true,
            },
        },
        {
            $sort: {
                totalScore: -1,
                timeTakenSeconds: 1,
            },
        },
        {
            $lookup: {
                from: "Users",
                localField: "userId",
                foreignField: "_id",
                as: "user",
            },
        },
        {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: {
                _id: 0,
                userId: 1,
                username: "$user.username",
                totalScore: 1,
                timeTakenSeconds: 1,
                caseId: 1,
            },
        },
    ]);
};

const getCaseStats = async (caseId) => {
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
        throw new Error("INVALID CASE ID");
    }

    const objectCaseId = new mongoose.Types.ObjectId(caseId);

    const sessionStats = await gameSessionModel.aggregate([
        {
            $match: {
                caseId: objectCaseId,
                isCompleted: true,
            },
        },
        {
            $group: {
                _id: null,
                totalSessions: { $sum: 1 },
                averageTimeSeconds: {
                    $avg: "$timeTakenSeconds",
                },
            },
        },
    ]);

    const questionStats = await gameSessionModel.aggregate([
        {
            $match: {
                caseId: objectCaseId,
                isCompleted: true,
            },
        },
        {
            $unwind: "$answers",
        },
        {
            $lookup: {
                from: "Questions",
                localField: "answers.questionId",
                foreignField: "_id",
                as: "question",
            },
        },
        {
            $unwind: "$question",
        },
        {
            $group: {
                _id: "$answers.questionId",
                questionText: {
                    $first: "$question.questionText",
                },
                totalAnswers: {
                    $sum: 1,
                },
                correctAnswers: {
                    $sum: {
                        $cond: [
                            {
                                $eq: [
                                    "$answers.selectedAnswer",
                                    "$question.correctAnswer",
                                ],
                            },
                            1,
                            0,
                        ],
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                questionId: "$_id",
                questionText: 1,
                totalAnswers: 1,
                correctAnswers: 1,
                correctPercentage: {
                    $multiply: [
                        {
                            $divide: [
                                "$correctAnswers",
                                "$totalAnswers",
                            ],
                        },
                        100,
                    ],
                },
            },
        },
        {
            $sort: {
                questionId: 1,
            },
        },
    ]);

    return {
        sessionStats: sessionStats[0] || {
            totalSessions: 0,
            averageTimeSeconds: 0,
        },
        questionStats,
    };
};

module.exports = {
    getLeaderboard,
    getCaseStats,
};