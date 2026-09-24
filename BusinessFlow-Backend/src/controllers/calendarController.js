const mongoose = require("mongoose");

const CalendarEvent = require("../models/CalendarEvent");
const Task = require("../models/Task");
const User = require("../models/User");
const Customer = require("../models/Customer");
const Lead = require("../models/Lead");
const Deal = require("../models/Deal");

// =====================================================
// HELPERS
// =====================================================

const getCompanyId = (req) => {
  if (!req.user?.companyId) {
    return null;
  }

  return (
    req.user.companyId._id ||
    req.user.companyId
  );
};

const getUserId = (req) => {
  return req.user?._id || null;
};

const isAdmin = (req) => {
  return req.user?.role === "admin";
};

const isValidObjectId = (id) => {
  return Boolean(
    id &&
      mongoose.Types.ObjectId.isValid(id)
  );
};

// =====================================================
// DATE PARSER
// =====================================================

const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

// =====================================================
// USER FORMATTER
// =====================================================

const formatUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    _id: user._id,

    firstName:
      user.firstName || "",

    lastName:
      user.lastName || "",

    name:
      `${user.firstName || ""} ${
        user.lastName || ""
      }`.trim(),

    email:
      user.email || "",

    role:
      user.role || null,
  };
};

// =====================================================
// CUSTOMER FORMATTER
// =====================================================

const formatCustomer = (
  customer
) => {
  if (!customer) {
    return null;
  }

  return {
    _id: customer._id,

    firstName:
      customer.firstName || "",

    lastName:
      customer.lastName || "",

    companyName:
      customer.companyName || "",

    email:
      customer.email || "",
  };
};

// =====================================================
// LEAD FORMATTER
// =====================================================

const formatLead = (lead) => {
  if (!lead) {
    return null;
  }

  return {
    _id: lead._id,

    firstName:
      lead.firstName || "",

    lastName:
      lead.lastName || "",

    company:
      lead.company || "",

    email:
      lead.email || "",
  };
};

// =====================================================
// DEAL FORMATTER
// =====================================================

const formatDeal = (deal) => {
  if (!deal) {
    return null;
  }

  return {
    _id: deal._id,

    title:
      deal.title || "",

    value:
      deal.value || 0,

    stage:
      deal.stage || "",

    status:
      deal.status || "",
  };
};

// =====================================================
// EVENT FORMATTER
// =====================================================

const formatEvent = (event) => {
  if (!event) {
    return null;
  }

  return {
    _id: event._id,

    title:
      event.title || "",

    description:
      event.description || null,

    type:
      event.type || "Meeting",

    startAt:
      event.startAt || null,

    endAt:
      event.endAt || null,

    allDay:
      Boolean(event.allDay),

    location:
      event.location || null,

    status:
      event.status || "Scheduled",

    reminderMinutes:
      event.reminderMinutes ?? 15,

    createdBy:
      formatUser(event.createdBy),

    assignedTo:
      formatUser(event.assignedTo),

    customerId:
      formatCustomer(event.customerId),

    leadId:
      formatLead(event.leadId),

    dealId:
      formatDeal(event.dealId),

    createdAt:
      event.createdAt || null,

    updatedAt:
      event.updatedAt || null,
  };
};

// =====================================================
// POPULATE EVENT
// =====================================================

const populateEvent = (query) => {
  return query
    .populate(
      "createdBy",
      "firstName lastName email role"
    )
    .populate(
      "assignedTo",
      "firstName lastName email role isActive"
    )
    .populate(
      "customerId",
      "firstName lastName companyName email phone status"
    )
    .populate(
      "leadId",
      "firstName lastName company email phone status"
    )
    .populate(
      "dealId",
      "title value stage status"
    );
};

// =====================================================
// VALIDATE ASSIGNEE
// =====================================================

const validateAssignee = async (
  assignedTo,
  companyId
) => {
  if (!assignedTo) {
    return {
      valid: false,
      message:
        "Event assignee is required.",
    };
  }

  if (!isValidObjectId(assignedTo)) {
    return {
      valid: false,
      message:
        "Invalid employee ID.",
    };
  }

  const user =
    await User.findOne({
      _id: assignedTo,
      companyId,
      isActive: true,
    }).select(
      "_id firstName lastName email role isActive"
    );

  if (!user) {
    return {
      valid: false,
      message:
        "Selected employee does not belong to this company or is inactive.",
    };
  }

  return {
    valid: true,
    user,
  };
};

// =====================================================
// VALIDATE RELATED RECORDS
// =====================================================

const validateRelatedRecords =
  async ({
    customerId,
    leadId,
    dealId,
    companyId,
  }) => {
    if (customerId) {
      if (
        !isValidObjectId(
          customerId
        )
      ) {
        return {
          valid: false,
          message:
            "Invalid customer ID.",
        };
      }

      const customer =
        await Customer.findOne({
          _id: customerId,
          companyId,
        }).select("_id");

      if (!customer) {
        return {
          valid: false,
          message:
            "Customer does not belong to this company.",
        };
      }
    }

    if (leadId) {
      if (
        !isValidObjectId(leadId)
      ) {
        return {
          valid: false,
          message:
            "Invalid lead ID.",
        };
      }

      const lead =
        await Lead.findOne({
          _id: leadId,
          companyId,
        }).select("_id");

      if (!lead) {
        return {
          valid: false,
          message:
            "Lead does not belong to this company.",
        };
      }
    }

    if (dealId) {
      if (
        !isValidObjectId(dealId)
      ) {
        return {
          valid: false,
          message:
            "Invalid deal ID.",
        };
      }

      const deal =
        await Deal.findOne({
          _id: dealId,
          companyId,
        }).select("_id");

      if (!deal) {
        return {
          valid: false,
          message:
            "Deal does not belong to this company.",
        };
      }
    }

    return {
      valid: true,
    };
  };

// =====================================================
// GET MY CALENDAR EVENTS
// GET /api/calendar/me/events
// =====================================================

const getMyCalendarEvents =
  async (req, res) => {
    try {
      const companyId =
        getCompanyId(req);

      const userId =
        getUserId(req);

      if (!companyId || !userId) {
        return res.status(400).json({
          success: false,
          message:
            "User or company information is missing.",
        });
      }

      const {
        start,
        end,
        type,
        status,
        search,
      } = req.query;

      const filter = {
        companyId,
        assignedTo: userId,
      };

      // =================================================
      // DATE RANGE
      // =================================================

      if (start || end) {
        filter.startAt = {};

        if (start) {
          const startDate =
            parseDate(start);

          if (!startDate) {
            return res.status(400).json({
              success: false,
              message:
                "Invalid start date.",
            });
          }

          filter.startAt.$gte =
            startDate;
        }

        if (end) {
          const endDate =
            parseDate(end);

          if (!endDate) {
            return res.status(400).json({
              success: false,
              message:
                "Invalid end date.",
            });
          }

          filter.startAt.$lte =
            endDate;
        }
      }

      // =================================================
      // TYPE
      // =================================================

      if (type) {
        const allowedTypes = [
          "Meeting",
          "Follow-up",
          "Call",
          "Demo",
          "Review",
          "Task",
          "Other",
        ];

        if (
          !allowedTypes.includes(
            type
          )
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid event type.",
          });
        }

        filter.type = type;
      }

      // =================================================
      // STATUS
      // =================================================

      if (status) {
        const allowedStatuses = [
          "Scheduled",
          "Completed",
          "Cancelled",
        ];

        if (
          !allowedStatuses.includes(
            status
          )
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid event status.",
          });
        }

        filter.status = status;
      }

      // =================================================
      // SEARCH
      // =================================================

      if (search?.trim()) {
        filter.title = {
          $regex: search.trim(),
          $options: "i",
        };
      }

      const events =
        await populateEvent(
          CalendarEvent.find(filter)
            .sort({
              startAt: 1,
            })
            .lean()
        );

      return res.status(200).json({
        success: true,

        message:
          "Calendar events fetched successfully.",

        data:
          events.map(formatEvent),
      });
    } catch (error) {
      console.error(
        "Get My Calendar Events Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Something went wrong while fetching calendar events.",
      });
    }
  };

// =====================================================
// GET TODAY'S SCHEDULE
// GET /api/calendar/me/today
// =====================================================

const getMyTodaySchedule =
  async (req, res) => {
    try {
      const companyId =
        getCompanyId(req);

      const userId =
        getUserId(req);

      if (!companyId || !userId) {
        return res.status(400).json({
          success: false,
          message:
            "User or company information is missing.",
        });
      }

      const now =
        new Date();

      const todayStart =
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

      const tomorrowStart =
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1
        );

      const events =
        await populateEvent(
          CalendarEvent.find({
            companyId,

            assignedTo: userId,

            startAt: {
              $gte: todayStart,
              $lt: tomorrowStart,
            },

            status: {
              $ne: "Cancelled",
            },
          })
            .sort({
              startAt: 1,
            })
            .limit(20)
            .lean()
        );

      return res.status(200).json({
        success: true,

        message:
          "Today's schedule fetched successfully.",

        data:
          events.map(formatEvent),
      });
    } catch (error) {
      console.error(
        "Get Today's Schedule Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Something went wrong while fetching today's schedule.",
      });
    }
  };

// =====================================================
// GET UPCOMING EVENTS
// GET /api/calendar/me/upcoming
// =====================================================

const getMyUpcomingEvents =
  async (req, res) => {
    try {
      const companyId =
        getCompanyId(req);

      const userId =
        getUserId(req);

      if (!companyId || !userId) {
        return res.status(400).json({
          success: false,
          message:
            "User or company information is missing.",
        });
      }

      const limit = Math.min(
        Math.max(
          Number(
            req.query.limit
          ) || 5,
          1
        ),
        20
      );

      const now =
        new Date();

      const events =
        await populateEvent(
          CalendarEvent.find({
            companyId,

            assignedTo: userId,

            status: "Scheduled",

            startAt: {
              $gte: now,
            },
          })
            .sort({
              startAt: 1,
            })
            .limit(limit)
            .lean()
        );

      return res.status(200).json({
        success: true,

        message:
          "Upcoming events fetched successfully.",

        data:
          events.map(formatEvent),
      });
    } catch (error) {
      console.error(
        "Get Upcoming Events Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Something went wrong while fetching upcoming events.",
      });
    }
  };

// =====================================================
// GET TASKS DUE
// GET /api/calendar/me/tasks-due
// =====================================================

const getMyCalendarTasksDue =
  async (req, res) => {
    try {
      const companyId =
        getCompanyId(req);

      const userId =
        getUserId(req);

      if (!companyId || !userId) {
        return res.status(400).json({
          success: false,
          message:
            "User or company information is missing.",
        });
      }

      const limit = Math.min(
        Math.max(
          Number(
            req.query.limit
          ) || 5,
          1
        ),
        20
      );

      const now =
        new Date();

      const tasks =
        await Task.find({
          companyId,

          assignedTo: userId,

          status: {
            $in: [
              "Pending",
              "In Progress",
            ],
          },

          dueAt: {
            $gte: now,
          },
        })
          .sort({
            dueAt: 1,
          })
          .limit(limit)
          .populate(
            "customerId",
            "firstName lastName companyName email"
          )
          .populate(
            "leadId",
            "firstName lastName company email"
          )
          .populate(
            "dealId",
            "title value stage status"
          )
          .lean();

      const formattedTasks =
        tasks.map(
          (task) => ({
            _id: task._id,

            title:
              task.title || "",

            status:
              task.status,

            priority:
              task.priority,

            dueAt:
              task.dueAt,

            customerId:
              formatCustomer(
                task.customerId
              ),

            leadId:
              formatLead(
                task.leadId
              ),

            dealId:
              formatDeal(
                task.dealId
              ),
          })
        );

      return res.status(200).json({
        success: true,

        message:
          "Tasks due fetched successfully.",

        data:
          formattedTasks,
      });
    } catch (error) {
      console.error(
        "Get Calendar Tasks Due Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Something went wrong while fetching tasks due.",
      });
    }
  };

// =====================================================
// GET SINGLE EVENT
// GET /api/calendar/events/:id
// =====================================================

const getCalendarEventById =
  async (req, res) => {
    try {
      const companyId =
        getCompanyId(req);

      const userId =
        getUserId(req);

      const { id } =
        req.params;

      if (!companyId || !userId) {
        return res.status(400).json({
          success: false,
          message:
            "User or company information is missing.",
        });
      }

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid calendar event ID.",
        });
      }

      const filter = {
        _id: id,
        companyId,
      };

      if (!isAdmin(req)) {
        filter.assignedTo =
          userId;
      }

      const event =
        await populateEvent(
          CalendarEvent.findOne(
            filter
          ).lean()
        );

      if (!event) {
        return res.status(404).json({
          success: false,
          message:
            "Calendar event not found.",
        });
      }

      return res.status(200).json({
        success: true,

        message:
          "Calendar event fetched successfully.",

        data:
          formatEvent(event),
      });
    } catch (error) {
      console.error(
        "Get Calendar Event Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Something went wrong while fetching the calendar event.",
      });
    }
  };

// =====================================================
// CREATE EVENT
// POST /api/calendar/events
// =====================================================

const createCalendarEvent =
  async (req, res) => {
    try {
      const companyId =
        getCompanyId(req);

      const userId =
        getUserId(req);

      if (!companyId || !userId) {
        return res.status(400).json({
          success: false,
          message:
            "User or company information is missing.",
        });
      }

      const {
        title,
        description,
        type = "Meeting",
        startAt,
        endAt,
        allDay = false,
        location,
        assignedTo,
        customerId,
        leadId,
        dealId,
        reminderMinutes = 15,
      } = req.body;

      // =================================================
      // TITLE
      // =================================================

      if (!title?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Event title is required.",
        });
      }

      // =================================================
      // TYPE
      // =================================================

      const allowedTypes = [
        "Meeting",
        "Follow-up",
        "Call",
        "Demo",
        "Review",
        "Task",
        "Other",
      ];

      if (
        !allowedTypes.includes(
          type
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid event type.",
        });
      }

      // =================================================
      // DATES
      // =================================================

      const parsedStart =
        parseDate(startAt);

      const parsedEnd =
        parseDate(endAt);

      if (!parsedStart) {
        return res.status(400).json({
          success: false,
          message:
            "Valid event start date is required.",
        });
      }

      if (!parsedEnd) {
        return res.status(400).json({
          success: false,
          message:
            "Valid event end date is required.",
        });
      }

      if (
        parsedEnd <= parsedStart
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Event end time must be after the start time.",
        });
      }

      // =================================================
      // ASSIGNEE
      // =================================================

      let finalAssignedTo =
        assignedTo;

      if (!isAdmin(req)) {
        finalAssignedTo =
          userId;
      }

      const assigneeResult =
        await validateAssignee(
          finalAssignedTo,
          companyId
        );

      if (
        !assigneeResult.valid
      ) {
        return res.status(400).json({
          success: false,
          message:
            assigneeResult.message,
        });
      }

      // =================================================
      // RELATED RECORDS
      // =================================================

      const relatedResult =
        await validateRelatedRecords({
          customerId:
            customerId || null,

          leadId:
            leadId || null,

          dealId:
            dealId || null,

          companyId,
        });

      if (
        !relatedResult.valid
      ) {
        return res.status(400).json({
          success: false,
          message:
            relatedResult.message,
        });
      }

      // =================================================
      // CREATE
      // =================================================

      const event =
        await CalendarEvent.create({
          companyId,

          createdBy:
            userId,

          assignedTo:
            finalAssignedTo,

          title:
            title.trim(),

          description:
            description?.trim() ||
            null,

          type,

          startAt:
            parsedStart,

          endAt:
            parsedEnd,

          allDay:
            Boolean(allDay),

          location:
            location?.trim() ||
            null,

          customerId:
            customerId || null,

          leadId:
            leadId || null,

          dealId:
            dealId || null,

          status:
            "Scheduled",

          reminderMinutes:
            Number(
              reminderMinutes
            ) || 15,
        });

      // =================================================
      // FETCH POPULATED EVENT
      // =================================================

      const populatedEvent =
        await populateEvent(
          CalendarEvent.findById(
            event._id
          ).lean()
        );

      return res.status(201).json({
        success: true,

        message:
          "Calendar event created successfully.",

        data:
          formatEvent(
            populatedEvent
          ),
      });
    } catch (error) {
      console.error(
        "Create Calendar Event Error:",
        error
      );

      if (
        error.name ===
        "ValidationError"
      ) {
        const message =
          Object.values(
            error.errors || {}
          )
            .map(
              (item) =>
                item.message
            )
            .join(", ");

        return res.status(400).json({
          success: false,
          message:
            message ||
            "Calendar event validation failed.",
        });
      }

      return res.status(500).json({
        success: false,
        message:
          "Something went wrong while creating the calendar event.",
      });
    }
  };

// =====================================================
// UPDATE EVENT
// PATCH /api/calendar/events/:id
// =====================================================

const updateCalendarEvent =
  async (req, res) => {
    try {
      const companyId =
        getCompanyId(req);

      const userId =
        getUserId(req);

      const { id } =
        req.params;

      if (!companyId || !userId) {
        return res.status(400).json({
          success: false,
          message:
            "User or company information is missing.",
        });
      }

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid calendar event ID.",
        });
      }

      const filter = {
        _id: id,
        companyId,
      };

      if (!isAdmin(req)) {
        filter.assignedTo =
          userId;
      }

      const event =
        await CalendarEvent.findOne(
          filter
        );

      if (!event) {
        return res.status(404).json({
          success: false,
          message:
            "Calendar event not found.",
        });
      }

      const {
        title,
        description,
        type,
        startAt,
        endAt,
        allDay,
        location,
        assignedTo,
        customerId,
        leadId,
        dealId,
        status,
        reminderMinutes,
      } = req.body;

      // =================================================
      // TITLE
      // =================================================

      if (
        title !== undefined
      ) {
        if (
          !String(title).trim()
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Event title cannot be empty.",
          });
        }

        event.title =
          String(title).trim();
      }

      // =================================================
      // DESCRIPTION
      // =================================================

      if (
        description !==
        undefined
      ) {
        event.description =
          String(
            description
          ).trim() || null;
      }

      // =================================================
      // TYPE
      // =================================================

      if (
        type !== undefined
      ) {
        const allowedTypes = [
          "Meeting",
          "Follow-up",
          "Call",
          "Demo",
          "Review",
          "Task",
          "Other",
        ];

        if (
          !allowedTypes.includes(
            type
          )
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid event type.",
          });
        }

        event.type = type;
      }

      // =================================================
      // DATES
      // =================================================

      if (
        startAt !==
        undefined
      ) {
        const parsedStart =
          parseDate(startAt);

        if (!parsedStart) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid event start date.",
          });
        }

        event.startAt =
          parsedStart;
      }

      if (
        endAt !==
        undefined
      ) {
        const parsedEnd =
          parseDate(endAt);

        if (!parsedEnd) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid event end date.",
          });
        }

        event.endAt =
          parsedEnd;
      }

      if (
        event.endAt <=
        event.startAt
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Event end time must be after the start time.",
        });
      }

      // =================================================
      // ALL DAY
      // =================================================

      if (
        allDay !== undefined
      ) {
        event.allDay =
          Boolean(allDay);
      }

      // =================================================
      // LOCATION
      // =================================================

      if (
        location !==
        undefined
      ) {
        event.location =
          String(
            location
          ).trim() || null;
      }

      // =================================================
      // ASSIGNEE
      // =================================================

      if (
        assignedTo !==
        undefined
      ) {
        if (!isAdmin(req)) {
          return res.status(403).json({
            success: false,
            message:
              "Employees cannot reassign calendar events.",
          });
        }

        const assigneeResult =
          await validateAssignee(
            assignedTo,
            companyId
          );

        if (
          !assigneeResult.valid
        ) {
          return res.status(400).json({
            success: false,
            message:
              assigneeResult.message,
          });
        }

        event.assignedTo =
          assignedTo;
      }

      // =================================================
      // RELATED RECORDS
      // =================================================

      const relatedProvided =
        customerId !==
          undefined ||
        leadId !==
          undefined ||
        dealId !==
          undefined;

      if (
        relatedProvided
      ) {
        const finalCustomerId =
          customerId !==
          undefined
            ? customerId || null
            : event.customerId;

        const finalLeadId =
          leadId !== undefined
            ? leadId || null
            : event.leadId;

        const finalDealId =
          dealId !== undefined
            ? dealId || null
            : event.dealId;

        const relatedResult =
          await validateRelatedRecords({
            customerId:
              finalCustomerId,

            leadId:
              finalLeadId,

            dealId:
              finalDealId,

            companyId,
          });

        if (
          !relatedResult.valid
        ) {
          return res.status(400).json({
            success: false,
            message:
              relatedResult.message,
          });
        }

        event.customerId =
          finalCustomerId;

        event.leadId =
          finalLeadId;

        event.dealId =
          finalDealId;
      }

      // =================================================
      // STATUS
      // =================================================

      if (
        status !== undefined
      ) {
        const allowedStatuses = [
          "Scheduled",
          "Completed",
          "Cancelled",
        ];

        if (
          !allowedStatuses.includes(
            status
          )
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid event status.",
          });
        }

        event.status =
          status;
      }

      // =================================================
      // REMINDER
      // =================================================

      if (
        reminderMinutes !==
        undefined
      ) {
        event.reminderMinutes =
          Number(
            reminderMinutes
          );
      }

      await event.save();

      const updatedEvent =
        await populateEvent(
          CalendarEvent.findById(
            event._id
          ).lean()
        );

      return res.status(200).json({
        success: true,

        message:
          "Calendar event updated successfully.",

        data:
          formatEvent(
            updatedEvent
          ),
      });
    } catch (error) {
      console.error(
        "Update Calendar Event Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Something went wrong while updating the calendar event.",
      });
    }
  };

// =====================================================
// DELETE EVENT
// DELETE /api/calendar/events/:id
// =====================================================

const deleteCalendarEvent =
  async (req, res) => {
    try {
      const companyId =
        getCompanyId(req);

      const userId =
        getUserId(req);

      const { id } =
        req.params;

      if (!companyId || !userId) {
        return res.status(400).json({
          success: false,
          message:
            "User or company information is missing.",
        });
      }

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid calendar event ID.",
        });
      }

      const filter = {
        _id: id,
        companyId,
      };

      if (!isAdmin(req)) {
        filter.assignedTo =
          userId;
      }

      const event =
        await CalendarEvent.findOneAndDelete(
          filter
        );

      if (!event) {
        return res.status(404).json({
          success: false,
          message:
            "Calendar event not found.",
        });
      }

      return res.status(200).json({
        success: true,

        message:
          "Calendar event deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete Calendar Event Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Something went wrong while deleting the calendar event.",
      });
    }
  };

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getMyCalendarEvents,
  getMyTodaySchedule,
  getMyUpcomingEvents,
  getMyCalendarTasksDue,

  getCalendarEventById,

  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
};