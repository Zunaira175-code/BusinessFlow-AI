const mongoose = require("mongoose");

const Notification = require("../models/Notification");
const User = require("../models/User");

// =====================================================
// CONSTANTS
// =====================================================

const VALID_NOTIFICATION_TYPES = [
  "lead",
  "deal",
  "task",
  "meeting",
];

const VALID_RELATED_MODELS = [
  "Lead",
  "Deal",
  "Task",
  "Meeting",
];

const VALID_STATUS_FILTERS = [
  "all",
  "read",
  "unread",
];

const VALID_DATE_FILTERS = [
  "all",
  "today",
  "week",
  "month",
];

const MAX_NOTIFICATION_LIMIT = 100;
const MAX_REMINDER_LIMIT = 20;

// =====================================================
// GET AUTHENTICATED COMPANY ID
// =====================================================

const getCompanyId = (req) => {
  return (
    req.user?.companyId?._id ||
    req.user?.companyId ||
    null
  );
};

// =====================================================
// GET AUTHENTICATED USER ID
// =====================================================

const getUserId = (req) => {
  return (
    req.user?._id ||
    req.user?.id ||
    null
  );
};

// =====================================================
// GET VALID COMPANY OBJECT ID
// =====================================================

const getCompanyObjectId = (req, res) => {
  const companyId = getCompanyId(req);

  if (!companyId) {
    res.status(401).json({
      success: false,
      message:
        "Company information not found.",
    });

    return null;
  }

  if (
    !mongoose.Types.ObjectId.isValid(
      companyId
    )
  ) {
    res.status(400).json({
      success: false,
      message:
        "Invalid company information.",
    });

    return null;
  }

  return new mongoose.Types.ObjectId(
    companyId
  );
};

// =====================================================
// GET VALID USER OBJECT ID
// =====================================================

const getUserObjectId = (req, res) => {
  const userId = getUserId(req);

  if (!userId) {
    res.status(401).json({
      success: false,
      message:
        "User information not found.",
    });

    return null;
  }

  if (
    !mongoose.Types.ObjectId.isValid(
      userId
    )
  ) {
    res.status(400).json({
      success: false,
      message:
        "Invalid user information.",
    });

    return null;
  }

  return new mongoose.Types.ObjectId(
    userId
  );
};

// =====================================================
// NORMALIZE NOTIFICATION TYPE
// =====================================================

const normalizeType = (type) => {
  if (!type) {
    return null;
  }

  const normalized = String(type)
    .trim()
    .toLowerCase();

  if (
    normalized === "all" ||
    normalized === "allnotifications"
  ) {
    return null;
  }

  return VALID_NOTIFICATION_TYPES.includes(
    normalized
  )
    ? normalized
    : null;
};

// =====================================================
// VALIDATE TYPE FILTER
// =====================================================

const isValidTypeFilter = (type) => {
  if (!type) {
    return true;
  }

  const normalized = String(type)
    .trim()
    .toLowerCase();

  return (
    normalized === "all" ||
    VALID_NOTIFICATION_TYPES.includes(
      normalized
    )
  );
};

// =====================================================
// VALIDATE STATUS FILTER
// =====================================================

const isValidStatusFilter = (status) => {
  if (!status) {
    return true;
  }

  return VALID_STATUS_FILTERS.includes(
    String(status)
      .trim()
      .toLowerCase()
  );
};

// =====================================================
// VALIDATE DATE FILTER
// =====================================================

const isValidDateFilter = (date) => {
  if (!date) {
    return true;
  }

  return VALID_DATE_FILTERS.includes(
    String(date)
      .trim()
      .toLowerCase()
  );
};

// =====================================================
// DATE RANGE HELPER
// =====================================================

const getDateRange = (date) => {
  if (!date) {
    return null;
  }

  const normalizedDate = String(date)
    .trim()
    .toLowerCase();

  if (normalizedDate === "all") {
    return null;
  }

  const now = new Date();

  // -------------------------------------------------
  // TODAY
  // -------------------------------------------------

  if (normalizedDate === "today") {
    const start = new Date(now);

    start.setHours(0, 0, 0, 0);

    const end = new Date(now);

    end.setHours(23, 59, 59, 999);

    return {
      start,
      end,
    };
  }

  // -------------------------------------------------
  // THIS WEEK
  // Monday -> Sunday
  // -------------------------------------------------

  if (normalizedDate === "week") {
    const start = new Date(now);

    const day = start.getDay();

    const difference =
      day === 0 ? 6 : day - 1;

    start.setDate(
      start.getDate() - difference
    );

    start.setHours(0, 0, 0, 0);

    const end = new Date(start);

    end.setDate(
      end.getDate() + 6
    );

    end.setHours(23, 59, 59, 999);

    return {
      start,
      end,
    };
  }

  // -------------------------------------------------
  // THIS MONTH
  // -------------------------------------------------

  if (normalizedDate === "month") {
    const start = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    start.setHours(0, 0, 0, 0);

    const end = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    );

    end.setHours(23, 59, 59, 999);

    return {
      start,
      end,
    };
  }

  return null;
};

// =====================================================
// FORMAT NOTIFICATION
// =====================================================

const formatNotification = (
  notification
) => {
  if (!notification) {
    return null;
  }

  return {
    id: notification._id,

    type:
      notification.type,

    title:
      notification.title,

    message:
      notification.message,

    isRead:
      Boolean(
        notification.isRead
      ),

    readAt:
      notification.readAt ||
      null,

    relatedId:
      notification.relatedId ||
      null,

    relatedModel:
      notification.relatedModel ||
      null,

    actionLabel:
      notification.actionLabel ||
      null,

    actionUrl:
      notification.actionUrl ||
      null,

    metadata:
      notification.metadata ||
      null,

    createdAt:
      notification.createdAt ||
      null,

    updatedAt:
      notification.updatedAt ||
      null,
  };
};

// =====================================================
// GET MY NOTIFICATIONS
// =====================================================
// Supports:
//
// GET /api/notifications
//
// ?search=proposal
// ?type=lead
// ?status=unread
// ?date=today
// ?page=1
// ?limit=20
//
// =====================================================

const getNotifications = async (
  req,
  res
) => {
  try {
    // -------------------------------------------------
    // AUTH
    // -------------------------------------------------

    const companyObjectId =
      getCompanyObjectId(
        req,
        res
      );

    if (!companyObjectId) {
      return;
    }

    const userObjectId =
      getUserObjectId(
        req,
        res
      );

    if (!userObjectId) {
      return;
    }

    // -------------------------------------------------
    // QUERY
    // -------------------------------------------------

    const {
      search = "",
      type,
      status,
      date,
      page = 1,
      limit = 20,
    } = req.query;

    // -------------------------------------------------
    // VALIDATE FILTERS
    // -------------------------------------------------

    if (!isValidTypeFilter(type)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid notification type filter.",
      });
    }

    if (!isValidStatusFilter(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid notification status filter.",
      });
    }

    if (!isValidDateFilter(date)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid notification date filter.",
      });
    }

    // -------------------------------------------------
    // PAGINATION
    // -------------------------------------------------

    const currentPage = Math.max(
      Number.parseInt(
        page,
        10
      ) || 1,
      1
    );

    const requestedLimit =
      Number.parseInt(
        limit,
        10
      ) || 20;

    const currentLimit =
      Math.min(
        Math.max(
          requestedLimit,
          1
        ),
        MAX_NOTIFICATION_LIMIT
      );

    const skip =
      (currentPage - 1) *
      currentLimit;

    // -------------------------------------------------
    // BASE FILTER
    // -------------------------------------------------

    const filter = {
      companyId:
        companyObjectId,

      userId:
        userObjectId,
    };

    // -------------------------------------------------
    // SEARCH
    // -------------------------------------------------

    const trimmedSearch =
      String(search || "")
        .trim();

    if (trimmedSearch) {
      const escapedSearch =
        trimmedSearch.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );

      const searchRegex =
        new RegExp(
          escapedSearch,
          "i"
        );

      filter.$or = [
        {
          title: searchRegex,
        },
        {
          message: searchRegex,
        },
        {
          actionLabel:
            searchRegex,
        },
      ];
    }

    // -------------------------------------------------
    // TYPE FILTER
    // -------------------------------------------------

    const normalizedType =
      normalizeType(type);

    if (normalizedType) {
      filter.type =
        normalizedType;
    }

    // -------------------------------------------------
    // STATUS FILTER
    // -------------------------------------------------

    const normalizedStatus =
      status
        ? String(status)
            .trim()
            .toLowerCase()
        : "all";

    if (
      normalizedStatus ===
      "read"
    ) {
      filter.isRead = true;
    }

    if (
      normalizedStatus ===
      "unread"
    ) {
      filter.isRead = false;
    }

    // -------------------------------------------------
    // DATE FILTER
    // -------------------------------------------------

    const dateRange =
      getDateRange(date);

    if (dateRange) {
      filter.createdAt = {
        $gte: dateRange.start,
        $lte: dateRange.end,
      };
    }

    // -------------------------------------------------
    // QUERY DATABASE
    // -------------------------------------------------

    const [
      notifications,
      total,
      unreadCount,
    ] = await Promise.all([
      Notification.find(filter)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(currentLimit)
        .lean(),

      Notification.countDocuments(
        filter
      ),

      Notification.countDocuments({
        companyId:
          companyObjectId,

        userId:
          userObjectId,

        isRead: false,
      }),
    ]);

    // -------------------------------------------------
    // PAGINATION
    // -------------------------------------------------

    const totalPages =
      total === 0
        ? 0
        : Math.ceil(
            total /
              currentLimit
          );

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return res.status(200).json({
      success: true,

      data:
        notifications.map(
          formatNotification
        ),

      unreadCount,

      pagination: {
        page:
          currentPage,

        limit:
          currentLimit,

        total,

        totalPages,

        hasNextPage:
          currentPage <
          totalPages,

        hasPreviousPage:
          currentPage > 1 &&
          totalPages > 0,
      },
    });
  } catch (error) {
    console.error(
      "Get Notifications Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load notifications.",
    });
  }
};

// =====================================================
// GET NOTIFICATION STATS
// =====================================================

const getNotificationStats = async (
  req,
  res
) => {
  try {
    const companyObjectId =
      getCompanyObjectId(
        req,
        res
      );

    if (!companyObjectId) {
      return;
    }

    const userObjectId =
      getUserObjectId(
        req,
        res
      );

    if (!userObjectId) {
      return;
    }

    // -------------------------------------------------
    // AGGREGATE
    // -------------------------------------------------

    const stats =
      await Notification.aggregate([
        {
          $match: {
            companyId:
              companyObjectId,

            userId:
              userObjectId,
          },
        },

        {
          $group: {
            _id: null,

            total: {
              $sum: 1,
            },

            unread: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$isRead",
                      false,
                    ],
                  },
                  1,
                  0,
                ],
              },
            },

            leads: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$type",
                      "lead",
                    ],
                  },
                  1,
                  0,
                ],
              },
            },

            leadUnread: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $eq: [
                          "$type",
                          "lead",
                        ],
                      },
                      {
                        $eq: [
                          "$isRead",
                          false,
                        ],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },

            deals: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$type",
                      "deal",
                    ],
                  },
                  1,
                  0,
                ],
              },
            },

            dealUnread: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $eq: [
                          "$type",
                          "deal",
                        ],
                      },
                      {
                        $eq: [
                          "$isRead",
                          false,
                        ],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },

            tasks: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$type",
                      "task",
                    ],
                  },
                  1,
                  0,
                ],
              },
            },

            taskUnread: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $eq: [
                          "$type",
                          "task",
                        ],
                      },
                      {
                        $eq: [
                          "$isRead",
                          false,
                        ],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },

            meetings: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$type",
                      "meeting",
                    ],
                  },
                  1,
                  0,
                ],
              },
            },

            meetingUnread: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $eq: [
                          "$type",
                          "meeting",
                        ],
                      },
                      {
                        $eq: [
                          "$isRead",
                          false,
                        ],
                      },
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

    // -------------------------------------------------
    // DEFAULT
    // -------------------------------------------------

    const data =
      stats[0] || {
        total: 0,
        unread: 0,

        leads: 0,
        leadUnread: 0,

        deals: 0,
        dealUnread: 0,

        tasks: 0,
        taskUnread: 0,

        meetings: 0,
        meetingUnread: 0,
      };

    const tasks =
      data.tasks || 0;

    const meetings =
      data.meetings || 0;

    const taskUnread =
      data.taskUnread || 0;

    const meetingUnread =
      data.meetingUnread || 0;

    const tasksAndMeetings =
      tasks + meetings;

    const tasksAndMeetingsUnread =
      taskUnread +
      meetingUnread;

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return res.status(200).json({
      success: true,

      data: {
        allNotifications: {
          total:
            data.total || 0,

          unread:
            data.unread || 0,

          read:
            Math.max(
              (data.total || 0) -
                (data.unread || 0),
              0
            ),
        },

        leads: {
          total:
            data.leads || 0,

          unread:
            data.leadUnread || 0,

          read:
            Math.max(
              (data.leads || 0) -
                (data.leadUnread || 0),
              0
            ),
        },

        deals: {
          total:
            data.deals || 0,

          unread:
            data.dealUnread || 0,

          read:
            Math.max(
              (data.deals || 0) -
                (data.dealUnread || 0),
              0
            ),
        },

        tasksAndMeetings: {
          total:
            tasksAndMeetings,

          unread:
            tasksAndMeetingsUnread,

          read:
            Math.max(
              tasksAndMeetings -
                tasksAndMeetingsUnread,
              0
            ),

          tasks,

          taskUnread,

          meetings,

          meetingUnread,
        },
      },
    });
  } catch (error) {
    console.error(
      "Notification Stats Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load notification statistics.",
    });
  }
};

// =====================================================
// GET UPCOMING REMINDERS
// =====================================================
//
// Uses notification metadata.dueAt.
//
// Expected:
// metadata: {
//   dueAt: Date,
//   companyName: "...",
//   ...
// }
//
// =====================================================

const getUpcomingReminders =
  async (req, res) => {
    try {
      const companyObjectId =
        getCompanyObjectId(
          req,
          res
        );

      if (!companyObjectId) {
        return;
      }

      const userObjectId =
        getUserObjectId(
          req,
          res
        );

      if (!userObjectId) {
        return;
      }

      // -------------------------------------------------
      // LIMIT
      // -------------------------------------------------

      const requestedLimit =
        Number.parseInt(
          req.query.limit,
          10
        ) || 10;

      const limit =
        Math.min(
          Math.max(
            requestedLimit,
            1
          ),
          MAX_REMINDER_LIMIT
        );

      // -------------------------------------------------
      // CURRENT TIME
      // -------------------------------------------------

      const now =
        new Date();

      // -------------------------------------------------
      // NEXT 30 DAYS
      // -------------------------------------------------

      const futureDate =
        new Date(now);

      futureDate.setDate(
        futureDate.getDate() +
          30
      );

      // -------------------------------------------------
      // FIND REMINDERS
      // -------------------------------------------------

      const reminders =
        await Notification.find({
          companyId:
            companyObjectId,

          userId:
            userObjectId,

          type: {
            $in: [
              "task",
              "meeting",
            ],
          },

          "metadata.dueAt": {
            $gte: now,
            $lte: futureDate,
          },
        })
          .sort({
            "metadata.dueAt": 1,
          })
          .limit(limit)
          .lean();

      // -------------------------------------------------
      // FORMAT
      // -------------------------------------------------

      const data =
        reminders.map(
          (reminder) => ({
            id:
              reminder._id,

            type:
              reminder.type,

            title:
              reminder.title,

            message:
              reminder.message,

            dueAt:
              reminder.metadata
                ?.dueAt ||
              null,

            relatedId:
              reminder.relatedId ||
              null,

            relatedModel:
              reminder.relatedModel ||
              null,

            actionLabel:
              reminder.actionLabel ||
              null,

            actionUrl:
              reminder.actionUrl ||
              null,

            isRead:
              Boolean(
                reminder.isRead
              ),

            metadata:
              reminder.metadata ||
              null,

            createdAt:
              reminder.createdAt ||
              null,
          })
        );

      // -------------------------------------------------
      // RESPONSE
      // -------------------------------------------------

      return res.status(200).json({
        success: true,

        data,

        count:
          data.length,
      });
    } catch (error) {
      console.error(
        "Upcoming Reminders Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load upcoming reminders.",
      });
    }
  };

// =====================================================
// MARK SINGLE NOTIFICATION AS READ
// =====================================================

const markNotificationAsRead =
  async (req, res) => {
    try {
      const companyObjectId =
        getCompanyObjectId(
          req,
          res
        );

      if (!companyObjectId) {
        return;
      }

      const userObjectId =
        getUserObjectId(
          req,
          res
        );

      if (!userObjectId) {
        return;
      }

      const { id } =
        req.params;

      // -------------------------------------------------
      // VALIDATE ID
      // -------------------------------------------------

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid notification ID.",
        });
      }

      // -------------------------------------------------
      // UPDATE
      // -------------------------------------------------

      const notification =
        await Notification.findOneAndUpdate(
          {
            _id: id,

            companyId:
              companyObjectId,

            userId:
              userObjectId,
          },

          {
            $set: {
              isRead: true,

              readAt:
                new Date(),
            },
          },

          {
            new: true,
          }
        ).lean();

      // -------------------------------------------------
      // NOT FOUND
      // -------------------------------------------------

      if (!notification) {
        return res.status(404).json({
          success: false,
          message:
            "Notification not found.",
        });
      }

      // -------------------------------------------------
      // RESPONSE
      // -------------------------------------------------

      return res.status(200).json({
        success: true,

        message:
          "Notification marked as read.",

        data:
          formatNotification(
            notification
          ),
      });
    } catch (error) {
      console.error(
        "Mark Notification Read Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update notification.",
      });
    }
  };

// =====================================================
// MARK ALL NOTIFICATIONS AS READ
// =====================================================

const markAllNotificationsAsRead =
  async (req, res) => {
    try {
      const companyObjectId =
        getCompanyObjectId(
          req,
          res
        );

      if (!companyObjectId) {
        return;
      }

      const userObjectId =
        getUserObjectId(
          req,
          res
        );

      if (!userObjectId) {
        return;
      }

      // -------------------------------------------------
      // UPDATE
      // -------------------------------------------------

      const result =
        await Notification.updateMany(
          {
            companyId:
              companyObjectId,

            userId:
              userObjectId,

            isRead: false,
          },

          {
            $set: {
              isRead: true,

              readAt:
                new Date(),
            },
          }
        );

      // -------------------------------------------------
      // RESPONSE
      // -------------------------------------------------

      return res.status(200).json({
        success: true,

        message:
          "All notifications marked as read.",

        data: {
          updatedCount:
            result.modifiedCount ||
            0,
        },
      });
    } catch (error) {
      console.error(
        "Mark All Notifications Read Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to mark all notifications as read.",
      });
    }
  };

// =====================================================
// GET NOTIFICATION PREFERENCES
// =====================================================
//
// NOTE:
// User model must contain:
//
// notificationPreferences: {
//   leads: Boolean,
//   deals: Boolean,
//   tasks: Boolean,
//   meetings: Boolean
// }
//
// =====================================================

const getNotificationPreferences =
  async (req, res) => {
    try {
      const userObjectId =
        getUserObjectId(
          req,
          res
        );

      if (!userObjectId) {
        return;
      }

      const companyObjectId =
        getCompanyObjectId(
          req,
          res
        );

      if (!companyObjectId) {
        return;
      }

      const user =
        await User.findOne({
          _id:
            userObjectId,

          companyId:
            companyObjectId,
        })
          .select(
            "notificationPreferences"
          )
          .lean();

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User account not found.",
        });
      }

      const preferences =
        user.notificationPreferences ||
        {};

      return res.status(200).json({
        success: true,

        data: {
          leads:
            preferences.leads !==
            false,

          deals:
            preferences.deals !==
            false,

          tasks:
            preferences.tasks !==
            false,

          meetings:
            preferences.meetings !==
            false,
        },
      });
    } catch (error) {
      console.error(
        "Get Notification Preferences Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load notification preferences.",
      });
    }
  };

// =====================================================
// UPDATE NOTIFICATION PREFERENCES
// =====================================================

const updateNotificationPreferences =
  async (req, res) => {
    try {
      const userObjectId =
        getUserObjectId(
          req,
          res
        );

      if (!userObjectId) {
        return;
      }

      const companyObjectId =
        getCompanyObjectId(
          req,
          res
        );

      if (!companyObjectId) {
        return;
      }

      const {
        leads,
        deals,
        tasks,
        meetings,
      } = req.body || {};

      // -------------------------------------------------
      // VALIDATE
      // -------------------------------------------------

      const updates = {};

      if (
        typeof leads ===
        "boolean"
      ) {
        updates.leads =
          leads;
      }

      if (
        typeof deals ===
        "boolean"
      ) {
        updates.deals =
          deals;
      }

      if (
        typeof tasks ===
        "boolean"
      ) {
        updates.tasks =
          tasks;
      }

      if (
        typeof meetings ===
        "boolean"
      ) {
        updates.meetings =
          meetings;
      }

      if (
        Object.keys(updates)
          .length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "At least one valid notification preference is required.",
        });
      }

      // -------------------------------------------------
      // UPDATE USER
      // -------------------------------------------------

      const user =
        await User.findOneAndUpdate(
          {
            _id:
              userObjectId,

            companyId:
              companyObjectId,
          },

          {
            $set: Object.fromEntries(
              Object.entries(
                updates
              ).map(
                ([
                  key,
                  value,
                ]) => [
                  `notificationPreferences.${key}`,
                  value,
                ]
              )
            ),
          },

          {
            new: true,

            runValidators: true,
          }
        )
          .select(
            "notificationPreferences"
          )
          .lean();

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User account not found.",
        });
      }

      const preferences =
        user.notificationPreferences ||
        {};

      return res.status(200).json({
        success: true,

        message:
          "Notification preferences updated.",

        data: {
          leads:
            preferences.leads !==
            false,

          deals:
            preferences.deals !==
            false,

          tasks:
            preferences.tasks !==
            false,

          meetings:
            preferences.meetings !==
            false,
        },
      });
    } catch (error) {
      console.error(
        "Update Notification Preferences Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update notification preferences.",
      });
    }
  };

// =====================================================
// CREATE NOTIFICATION
// INTERNAL HELPER
// =====================================================
//
// Used by:
//
// Lead Controller
// Deal Controller
// Task Controller
// Meeting Controller
//
// =====================================================

const createNotification = async ({
  companyId,
  userId,
  type,
  title,
  message,
  relatedId = null,
  relatedModel = null,
  actionLabel = null,
  actionUrl = null,
  metadata = null,
}) => {
  try {
    // -------------------------------------------------
    // COMPANY VALIDATION
    // -------------------------------------------------

    if (
      !companyId ||
      !mongoose.Types.ObjectId.isValid(
        companyId
      )
    ) {
      throw new Error(
        "Invalid company ID."
      );
    }

    // -------------------------------------------------
    // USER VALIDATION
    // -------------------------------------------------

    if (
      !userId ||
      !mongoose.Types.ObjectId.isValid(
        userId
      )
    ) {
      throw new Error(
        "Invalid user ID."
      );
    }

    // -------------------------------------------------
    // TYPE
    // -------------------------------------------------

    const normalizedType =
      normalizeType(type);

    if (!normalizedType) {
      throw new Error(
        "Invalid notification type."
      );
    }

    // -------------------------------------------------
    // TITLE
    // -------------------------------------------------

    if (
      !title ||
      String(title)
        .trim()
        .length < 2
    ) {
      throw new Error(
        "Notification title is required."
      );
    }

    // -------------------------------------------------
    // MESSAGE
    // -------------------------------------------------

    if (
      !message ||
      String(message)
        .trim()
        .length < 2
    ) {
      throw new Error(
        "Notification message is required."
      );
    }

    // -------------------------------------------------
    // RELATED MODEL
    // -------------------------------------------------

    if (
      relatedModel !== null &&
      !VALID_RELATED_MODELS.includes(
        relatedModel
      )
    ) {
      throw new Error(
        "Invalid related notification model."
      );
    }

    // -------------------------------------------------
    // RELATED ID
    // -------------------------------------------------

    if (
      relatedId !== null &&
      !mongoose.Types.ObjectId.isValid(
        relatedId
      )
    ) {
      throw new Error(
        "Invalid related notification ID."
      );
    }

    // -------------------------------------------------
    // ACTION LABEL
    // -------------------------------------------------

    if (
      actionLabel !== null &&
      String(actionLabel)
        .trim()
        .length === 0
    ) {
      actionLabel = null;
    }

    // -------------------------------------------------
    // ACTION URL
    // -------------------------------------------------

    if (
      actionUrl !== null &&
      String(actionUrl)
        .trim()
        .length === 0
    ) {
      actionUrl = null;
    }

    // -------------------------------------------------
    // IDS
    // -------------------------------------------------

    const companyObjectId =
      new mongoose.Types.ObjectId(
        companyId
      );

    const userObjectId =
      new mongoose.Types.ObjectId(
        userId
      );

    const relatedObjectId =
      relatedId
        ? new mongoose.Types.ObjectId(
            relatedId
          )
        : null;

    // -------------------------------------------------
    // VERIFY TARGET USER
    // -------------------------------------------------

    const targetUser =
      await User.findOne({
        _id:
          userObjectId,

        companyId:
          companyObjectId,
      })
        .select(
          "_id companyId isActive notificationPreferences"
        )
        .lean();

    if (!targetUser) {
      throw new Error(
        "Notification target user does not belong to this company."
      );
    }

    // -------------------------------------------------
    // INACTIVE USER
    // -------------------------------------------------

    if (!targetUser.isActive) {
      throw new Error(
        "Cannot create notification for an inactive user."
      );
    }

    // -------------------------------------------------
    // CHECK PREFERENCE
    // -------------------------------------------------

    const preferences =
      targetUser.notificationPreferences;

    if (preferences) {
      const preferenceKey =
        normalizedType ===
        "lead"
          ? "leads"
          : normalizedType ===
            "deal"
          ? "deals"
          : normalizedType ===
            "task"
          ? "tasks"
          : "meetings";

      if (
        preferences[
          preferenceKey
        ] === false
      ) {
        return null;
      }
    }

    // -------------------------------------------------
    // CREATE
    // -------------------------------------------------

    const notification =
      await Notification.create({
        companyId:
          companyObjectId,

        userId:
          userObjectId,

        type:
          normalizedType,

        title:
          String(title).trim(),

        message:
          String(message).trim(),

        isRead: false,

        readAt: null,

        relatedId:
          relatedObjectId,

        relatedModel:
          relatedModel || null,

        actionLabel:
          actionLabel
            ? String(
                actionLabel
              ).trim()
            : null,

        actionUrl:
          actionUrl
            ? String(
                actionUrl
              ).trim()
            : null,

        metadata:
          metadata || null,
      });

    return notification;
  } catch (error) {
    console.error(
      "Create Notification Error:",
      error
    );

    throw error;
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getNotifications,

  getNotificationStats,

  getUpcomingReminders,

  markNotificationAsRead,

  markAllNotificationsAsRead,

  getNotificationPreferences,

  updateNotificationPreferences,

  createNotification,
};