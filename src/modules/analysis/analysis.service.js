import Todo from "../todo/todo.model.js";
import JournalEntry from "../../models/JournalEntry.js";

export const computeWorkspaceAnalytics = async (userId, range) => {
  // 1. Calibrate Timeline Boundaries
  const daysToTrack = range === "month" ? 30 : 7;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysToTrack);
  startDate.setHours(0, 0, 0, 0);

  // 2. Pipeline: Aggregate Task Data
  const todoStats = await Todo.aggregate([
    {
      $match: {
        userId: userId,
        $or: [
          { createdAt: { $gte: startDate } },
          { completedAt: { $gte: startDate } },
        ],
      },
    },
    {
      $group: {
        _id: null,
        totalCreated: {
          $sum: { $cond: [{ $gte: ["$createdAt", startDate] }, 1, 0] },
        },
        totalCompleted: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
        },
        pinnedCreated: {
          $sum: { $cond: [{ $eq: ["$isPinned", true] }, 1, 0] },
        },
        pinnedCompleted: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$isPinned", true] },
                  { $eq: ["$status", "completed"] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  const taskSummary = todoStats[0] || {
    totalCreated: 0,
    totalCompleted: 0,
    pinnedCreated: 0,
    pinnedCompleted: 0,
  };

  const completionRate =
    taskSummary.totalCreated > 0
      ? Math.round(
          (taskSummary.totalCompleted / taskSummary.totalCreated) * 100
        )
      : 0;

  const northStarSuccessRate =
    taskSummary.pinnedCreated > 0
      ? Math.round(
          (taskSummary.pinnedCompleted / taskSummary.pinnedCreated) * 100
        )
      : 0;

  // 3. Pipeline: Current Spatial Burden (Active Pending Horizon items)
  const spatialBurden = await Todo.aggregate([
    { $match: { userId: userId, status: "pending" } },
    { $group: { _id: "$horizonType", count: { $sum: 1 } } },
  ]);

  const spatialDistribution = { today: 0, week: 0, later: 0 };
  spatialBurden.forEach((bucket) => {
    if (spatialDistribution.hasOwnProperty(bucket._id)) {
      spatialDistribution[bucket._id] = bucket.count;
    }
  });

  // 4. Pipeline: Journal Mindset & Mood Distributions
  const journalStats = await JournalEntry.aggregate([
    {
      $match: {
        userId: userId,
        createdAt: { $gte: startDate },
        isDraft: false,
      },
    },
    {
      $facet: {
        totalLogs: [{ $count: "count" }],
        moodFrequencies: [
          { $group: { _id: "$mood", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ],
        averageWordCount: [
          { $group: { _id: null, avgWords: { $avg: "$wordCount" } } },
        ],
      },
    },
  ]);

  const totalJournals = journalStats[0]?.totalLogs[0]?.count || 0;
  const moodFrequencies = journalStats[0]?.moodFrequencies || [];
  const dominantMood =
    moodFrequencies.length > 0 ? moodFrequencies[0]._id : "neutral";
  const avgWordsWritten = journalStats[0]?.averageWordCount[0]?.avgWords
    ? Math.round(journalStats[0].averageWordCount[0].avgWords)
    : 0;

  // 5. Pipeline: Generate Timeline Sync Matrix Map
  const dailyTimelineTodos = await Todo.aggregate([
    {
      $match: {
        userId: userId,
        status: "completed",
        completedAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } },
        completedCount: { $sum: 1 },
      },
    },
  ]);

  const dailyTimelineJournals = await JournalEntry.aggregate([
    {
      $match: {
        userId: userId,
        createdAt: { $gte: startDate },
        isDraft: false,
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        mood: { $first: "$mood" },
      },
    },
  ]);

  // Merge datasets chronologically into an alignment payload
  const timelineMap = {};
  for (let i = 0; i < daysToTrack; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateString = d.toISOString().split("T")[0];
    timelineMap[dateString] = {
      date: dateString,
      completedCount: 0,
      mood: null,
      hasJournal: false,
    };
  }

  dailyTimelineTodos.forEach((item) => {
    if (timelineMap[item._id]) {
      timelineMap[item._id].completedCount = item.completedCount;
    }
  });

  dailyTimelineJournals.forEach((item) => {
    if (timelineMap[item._id]) {
      timelineMap[item._id].mood = item.mood;
      timelineMap[item._id].hasJournal = true;
    }
  });

  const chronologicalTimeline = Object.values(timelineMap).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // 6. Pipeline: Task Decay Rate (Velocity Lifespan)
  const decayStats = await Todo.aggregate([
    {
      $match: {
        userId: userId,
        status: "completed",
        completedAt: { $gte: startDate },
      },
    },
    {
      $project: {
        lifespanInDays: {
          $divide: [
            { $subtract: ["$completedAt", "$createdAt"] },
            1000 * 60 * 60 * 24, // ms * secs * mins * hours
          ],
        },
      },
    },
    {
      $group: {
        _id: null,
        averageLifespan: { $avg: "$lifespanInDays" },
      },
    },
  ]);

  const avgTaskLifespanDays = decayStats[0]?.averageLifespan
    ? parseFloat(decayStats[0].averageLifespan.toFixed(1))
    : 0;

  // 7. Core Payload Handshake
  return {
    range: range || "week",
    summary: {
      totalCreated: taskSummary.totalCreated,
      totalCompleted: taskSummary.totalCompleted,
      completionRate,
      northStarSuccessRate,
      avgTaskLifespanDays,
    },
    mindset: {
      journalCount: totalJournals,
      dominantMood,
      averageWordCount: avgWordsWritten,
      moodDistribution: moodFrequencies,
    },
    spatialDistribution,
    timeline: chronologicalTimeline,
  };
}; // <--- The missing brace is safely restored!
