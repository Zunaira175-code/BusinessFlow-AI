const mongoose = require("mongoose");

const Customer = require("../models/Customer");
const CustomerActivity = require("../models/CustomerActivity");
const User = require("../models/User");
const Task = require("../models/Task");

// =====================================================
// HELPERS
// =====================================================

const getCompanyId = (req) => {
  return req.user?.companyId?._id || req.user?.companyId;
};

const getUserId = (req) => {
  return req.user?._id || req.user?.id;
};

const getObjectId = (id) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return new mongoose.Types.ObjectId(id);
};

const isAdmin = (req) => {
  return req.user?.role === "admin";
};

const isEmployee = (req) => {
  return req.user?.role === "employee";
};

const escapeRegex = (value) => {
  return String(value).replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
};

const getStartOfToday = () => {
  const now = new Date();

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
};

const getEndOfToday = () => {
  const now = new Date();

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );
};

const getStartOfTomorrow = () => {
  const now = new Date();

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );
};

const getEndOfTomorrow = () => {
  const now = new Date();

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 2
  );
};

// =====================================================
// CUSTOMER STATS
// GET /api/customers/stats
//
// ADMIN:
//   Company-wide stats
//
// EMPLOYEE:
//   Automatically scoped to logged-in employee
// =====================================================

const getCustomerStats = async (req, res) => {
  try {
    const companyId = getCompanyId(req);

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company information is missing.",
      });
    }

    const companyObjectId = getObjectId(companyId);

    if (!companyObjectId) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID.",
      });
    }

    const query = {
      companyId: companyObjectId,
    };

    // Employee sees only assigned customers
    if (isEmployee(req)) {
      const userId = getUserId(req);
      const userObjectId = getObjectId(userId);

      if (!userObjectId) {
        return res.status(400).json({
          success: false,
          message: "Invalid employee ID.",
        });
      }

      query.accountManager = userObjectId;
    }

    // =================================================
    // START OF MONTH
    // =================================================

    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    // =================================================
    // CUSTOMER COUNTS
    // =================================================

    const totalCustomers =
      await Customer.countDocuments(query);

    const activeAccounts =
      await Customer.countDocuments({
        ...query,
        status: "Active",
      });

    const newThisMonth =
      await Customer.countDocuments({
        ...query,
        createdAt: {
          $gte: startOfMonth,
        },
      });

    const atRisk =
      await Customer.countDocuments({
        ...query,
        healthStatus: "At Risk",
      });

    // =================================================
    // AVERAGE ACCOUNT VALUE
    // =================================================

    const averageResult =
      await Customer.aggregate([
        {
          $match: query,
        },
        {
          $group: {
            _id: null,
            averageAccountValue: {
              $avg: "$accountValue",
            },
          },
        },
      ]);

    const averageAccountValue =
      averageResult.length > 0
        ? Number(
            averageResult[0]
              .averageAccountValue || 0
          )
        : 0;

    // =================================================
    // EMPLOYEE FOLLOW-UPS
    // =================================================

    let followUpsDue = 0;
    let followUpsToday = 0;

    if (isEmployee(req)) {
      const userObjectId = getObjectId(
        getUserId(req)
      );

      const startOfToday =
        getStartOfToday();

      const endOfToday =
        getEndOfToday();

      // Overdue + today's follow-ups
      followUpsDue =
        await Task.countDocuments({
          companyId: companyObjectId,
          assignedTo: userObjectId,
          customerId: {
            $ne: null,
          },
          status: {
            $in: [
              "Pending",
              "In Progress",
            ],
          },
          dueAt: {
            $lt: endOfToday,
          },
        });

      followUpsToday =
        await Task.countDocuments({
          companyId: companyObjectId,
          assignedTo: userObjectId,
          customerId: {
            $ne: null,
          },
          status: {
            $in: [
              "Pending",
              "In Progress",
            ],
          },
          dueAt: {
            $gte: startOfToday,
            $lt: endOfToday,
          },
        });
    }

    return res.status(200).json({
      success: true,
      message:
        "Customer stats fetched successfully.",

      data: {
        totalCustomers,
        activeAccounts,
        newThisMonth,
        averageAccountValue,

        // Employee dashboard values
        atRisk,
        followUpsDue,
        followUpsToday,
      },
    });
  } catch (error) {
    console.error(
      "Get Customer Stats Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch customer stats.",
    });
  }
};

// =====================================================
// EMPLOYEE CUSTOMER STATS
// GET /api/customers/me/stats
// =====================================================

const getMyCustomerStats = async (req, res) => {
  try {
    const companyId = getCompanyId(req);
    const userId = getUserId(req);

    if (!companyId || !userId) {
      return res.status(400).json({
        success: false,
        message:
          "User or company information is missing.",
      });
    }

    const companyObjectId =
      getObjectId(companyId);

    const userObjectId =
      getObjectId(userId);

    if (
      !companyObjectId ||
      !userObjectId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid user or company ID.",
      });
    }

    const customerQuery = {
      companyId: companyObjectId,
      accountManager: userObjectId,
    };

    // =================================================
    // CUSTOMER COUNTS
    // =================================================

    const [
      totalCustomers,
      activeCustomers,
      atRiskCustomers,
    ] = await Promise.all([
      Customer.countDocuments(
        customerQuery
      ),

      Customer.countDocuments({
        ...customerQuery,
        status: "Active",
      }),

      Customer.countDocuments({
        ...customerQuery,
        healthStatus: "At Risk",
      }),
    ]);

    // =================================================
    // FOLLOW-UPS
    // =================================================

    const startOfToday =
      getStartOfToday();

    const endOfToday =
      getEndOfToday();

    const [
      followUpsDue,
      followUpsToday,
    ] = await Promise.all([
      Task.countDocuments({
        companyId: companyObjectId,
        assignedTo: userObjectId,
        customerId: {
          $ne: null,
        },
        status: {
          $in: [
            "Pending",
            "In Progress",
          ],
        },
        dueAt: {
          $lt: endOfToday,
        },
      }),

      Task.countDocuments({
        companyId: companyObjectId,
        assignedTo: userObjectId,
        customerId: {
          $ne: null,
        },
        status: {
          $in: [
            "Pending",
            "In Progress",
          ],
        },
        dueAt: {
          $gte: startOfToday,
          $lt: endOfToday,
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message:
        "Employee customer stats fetched successfully.",

      data: {
        myCustomers:
          totalCustomers,

        activeCustomers,

        followUpsDue,

        followUpsToday,

        atRisk:
          atRiskCustomers,
      },
    });
  } catch (error) {
    console.error(
      "Get My Customer Stats Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch employee customer stats.",
    });
  }
};

// =====================================================
// GET CUSTOMERS
// GET /api/customers
//
// ADMIN:
//   All company customers
//
// EMPLOYEE:
//   Only assigned customers
// =====================================================

const getCustomers = async (req, res) => {
  try {
    const companyId = getCompanyId(req);

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message:
          "Company information is missing.",
      });
    }

    const companyObjectId =
      getObjectId(companyId);

    if (!companyObjectId) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid company ID.",
      });
    }

    const {
      search = "",
      status = "",
      accountManager = "",
      sort = "recent",
      page = 1,
      limit = 6,
    } = req.query;

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const perPage = Math.min(
      Math.max(
        Number(limit) || 6,
        1
      ),
      50
    );

    // =================================================
    // BASE QUERY
    // =================================================

    const query = {
      companyId: companyObjectId,
    };

    // =================================================
    // EMPLOYEE SCOPE
    // =================================================

    if (isEmployee(req)) {
      const userObjectId =
        getObjectId(
          getUserId(req)
        );

      if (!userObjectId) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid employee ID.",
        });
      }

      query.accountManager =
        userObjectId;
    }

    // =================================================
    // STATUS FILTER
    // =================================================

    if (
      status &&
      [
        "Active",
        "Pending",
        "Inactive",
      ].includes(status)
    ) {
      query.status = status;
    }

    // =================================================
    // ACCOUNT MANAGER
    // =================================================

    if (
      accountManager &&
      isAdmin(req)
    ) {
      const managerObjectId =
        getObjectId(
          accountManager
        );

      if (!managerObjectId) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid account manager ID.",
        });
      }

      query.accountManager =
        managerObjectId;
    }

    // =================================================
    // SEARCH
    // =================================================

    if (search.trim()) {
      const searchRegex =
        new RegExp(
          escapeRegex(
            search.trim()
          ),
          "i"
        );

      query.$or = [
        {
          firstName:
            searchRegex,
        },
        {
          lastName:
            searchRegex,
        },
        {
          companyName:
            searchRegex,
        },
        {
          email:
            searchRegex,
        },
        {
          industry:
            searchRegex,
        },
        {
          jobTitle:
            searchRegex,
        },
      ];
    }

    // =================================================
    // SORT
    // =================================================

    let sortQuery = {
      updatedAt: -1,
    };

    if (sort === "recent") {
      sortQuery = {
        updatedAt: -1,
      };
    }

    if (sort === "newest") {
      sortQuery = {
        createdAt: -1,
      };
    }

    if (sort === "oldest") {
      sortQuery = {
        createdAt: 1,
      };
    }

    if (sort === "value_high") {
      sortQuery = {
        accountValue: -1,
      };
    }

    if (sort === "value_low") {
      sortQuery = {
        accountValue: 1,
      };
    }

    // =================================================
    // COUNT
    // =================================================

    const totalCustomers =
      await Customer.countDocuments(
        query
      );

    const totalPages =
      Math.ceil(
        totalCustomers /
          perPage
      );

    // =================================================
    // FETCH
    // =================================================

    const customers =
      await Customer.find(query)
        .populate(
          "accountManager",
          "firstName lastName email jobTitle"
        )
        .sort(sortQuery)
        .skip(
          (currentPage - 1) *
            perPage
        )
        .limit(perPage)
        .lean();

    // =================================================
    // GET CUSTOMER IDS
    // =================================================

    const customerIds =
      customers.map(
        (customer) =>
          customer._id
      );

    // =================================================
    // NEXT FOLLOW-UPS
    // =================================================

    let followUps = [];

    if (
      customerIds.length > 0
    ) {
      const followUpQuery = {
        companyId:
          companyObjectId,

        customerId: {
          $in: customerIds,
        },

        status: {
          $in: [
            "Pending",
            "In Progress",
          ],
        },

        dueAt: {
          $ne: null,
        },
      };

      // Employee only gets own follow-ups
      if (isEmployee(req)) {
        followUpQuery.assignedTo =
          getObjectId(
            getUserId(req)
          );
      }

      followUps =
        await Task.find(
          followUpQuery
        )
          .sort({
            dueAt: 1,
          })
          .lean();
    }

    // =================================================
    // NEXT FOLLOW-UP MAP
    // =================================================

    const nextFollowUpMap =
      new Map();

    for (const task of followUps) {
      const customerId =
        String(
          task.customerId
        );

      if (
        !nextFollowUpMap.has(
          customerId
        )
      ) {
        nextFollowUpMap.set(
          customerId,
          task
        );
      }
    }

    // =================================================
    // FORMAT
    // =================================================

    const formattedCustomers =
      customers.map(
        (customer) => {
          const manager =
            customer.accountManager;

          const managerName =
            manager
              ? `${manager.firstName || ""} ${
                  manager.lastName || ""
                }`.trim()
              : null;

          const followUp =
            nextFollowUpMap.get(
              String(
                customer._id
              )
            );

          return {
            id:
              customer._id,

            _id:
              customer._id,

            firstName:
              customer.firstName,

            lastName:
              customer.lastName,

            name:
              `${customer.firstName || ""} ${
                customer.lastName || ""
              }`.trim(),

            initials:
              `${customer.firstName?.[0] || ""}${
                customer.lastName?.[0] || ""
              }`.toUpperCase(),

            companyName:
              customer.companyName,

            industry:
              customer.industry,

            email:
              customer.email,

            phone:
              customer.phone,

            jobTitle:
              customer.jobTitle,

            status:
              customer.status,

            accountManager:
              manager
                ? {
                    id:
                      manager._id,

                    name:
                      managerName ||
                      manager.email,

                    email:
                      manager.email,

                    jobTitle:
                      manager.jobTitle,
                  }
                : null,

            totalRevenue:
              customer.totalRevenue ||
              0,

            accountValue:
              customer.accountValue ||
              0,

            healthScore:
              customer.healthScore,

            healthStatus:
              customer.healthStatus,

            healthMessage:
              customer.healthMessage,

            lastContact:
              customer.lastActivityAt,

            lastActivityAt:
              customer.lastActivityAt,

            nextFollowUp:
              followUp
                ? {
                    id:
                      followUp._id,

                    title:
                      followUp.title,

                    dueAt:
                      followUp.dueAt,

                    status:
                      followUp.status,

                    priority:
                      followUp.priority,
                  }
                : null,

            createdAt:
              customer.createdAt,

            updatedAt:
              customer.updatedAt,
          };
        }
      );

    return res.status(200).json({
      success: true,

      message:
        "Customers fetched successfully.",

      data:
        formattedCustomers,

      pagination: {
        page:
          currentPage,

        limit:
          perPage,

        total:
          totalCustomers,

        totalPages,

        hasNextPage:
          currentPage <
          totalPages,

        hasPreviousPage:
          currentPage > 1,
      },
    });
  } catch (error) {
    console.error(
      "Get Customers Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch customers.",
    });
  }
};

// =====================================================
// EMPLOYEE CUSTOMER DIRECTORY
// GET /api/customers/me
// =====================================================

const getMyCustomers = async (
  req,
  res
) => {
  try {
    const companyId =
      getCompanyId(req);

    const userId =
      getUserId(req);

    if (
      !companyId ||
      !userId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "User or company information is missing.",
      });
    }

    const companyObjectId =
      getObjectId(companyId);

    const userObjectId =
      getObjectId(userId);

    if (
      !companyObjectId ||
      !userObjectId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid user or company ID.",
      });
    }

    // Force employee scope
    req.query = {
      ...req.query,
    };

    const {
      search = "",
      status = "",
      sort = "recent",
      page = 1,
      limit = 5,
    } = req.query;

    const currentPage =
      Math.max(
        Number(page) || 1,
        1
      );

    const perPage =
      Math.min(
        Math.max(
          Number(limit) || 5,
          1
        ),
        50
      );

    const query = {
      companyId:
        companyObjectId,

      accountManager:
        userObjectId,
    };

    // =================================================
    // STATUS
    // =================================================

    if (
      status &&
      [
        "Active",
        "Pending",
        "Inactive",
      ].includes(status)
    ) {
      query.status = status;
    }

    // =================================================
    // SEARCH
    // =================================================

    if (search.trim()) {
      const searchRegex =
        new RegExp(
          escapeRegex(
            search.trim()
          ),
          "i"
        );

      query.$or = [
        {
          firstName:
            searchRegex,
        },
        {
          lastName:
            searchRegex,
        },
        {
          companyName:
            searchRegex,
        },
        {
          email:
            searchRegex,
        },
        {
          industry:
            searchRegex,
        },
        {
          jobTitle:
            searchRegex,
        },
      ];
    }

    // =================================================
    // SORT
    // =================================================

    let sortQuery = {
      updatedAt: -1,
    };

    if (sort === "newest") {
      sortQuery = {
        createdAt: -1,
      };
    }

    if (sort === "oldest") {
      sortQuery = {
        createdAt: 1,
      };
    }

    if (sort === "value_high") {
      sortQuery = {
        accountValue: -1,
      };
    }

    if (sort === "value_low") {
      sortQuery = {
        accountValue: 1,
      };
    }

    // =================================================
    // COUNT
    // =================================================

    const totalCustomers =
      await Customer.countDocuments(
        query
      );

    const totalPages =
      Math.ceil(
        totalCustomers /
          perPage
      );

    // =================================================
    // FETCH
    // =================================================

    const customers =
      await Customer.find(query)
        .populate(
          "accountManager",
          "firstName lastName email jobTitle"
        )
        .sort(sortQuery)
        .skip(
          (currentPage - 1) *
            perPage
        )
        .limit(perPage)
        .lean();

    // =================================================
    // FOLLOW-UPS
    // =================================================

    const customerIds =
      customers.map(
        (customer) =>
          customer._id
      );

    let followUps = [];

    if (
      customerIds.length > 0
    ) {
      followUps =
        await Task.find({
          companyId:
            companyObjectId,

          assignedTo:
            userObjectId,

          customerId: {
            $in: customerIds,
          },

          status: {
            $in: [
              "Pending",
              "In Progress",
            ],
          },

          dueAt: {
            $ne: null,
          },
        })
          .sort({
            dueAt: 1,
          })
          .lean();
    }

    const nextFollowUpMap =
      new Map();

    for (const task of followUps) {
      const customerId =
        String(
          task.customerId
        );

      if (
        !nextFollowUpMap.has(
          customerId
        )
      ) {
        nextFollowUpMap.set(
          customerId,
          task
        );
      }
    }

    // =================================================
    // FORMAT
    // =================================================

    const formattedCustomers =
      customers.map(
        (customer) => {
          const manager =
            customer.accountManager;

          const managerName =
            manager
              ? `${manager.firstName || ""} ${
                  manager.lastName || ""
                }`.trim()
              : null;

          const followUp =
            nextFollowUpMap.get(
              String(
                customer._id
              )
            );

          return {
            id:
              customer._id,

            _id:
              customer._id,

            firstName:
              customer.firstName,

            lastName:
              customer.lastName,

            name:
              `${customer.firstName || ""} ${
                customer.lastName || ""
              }`.trim(),

            initials:
              `${customer.firstName?.[0] || ""}${
                customer.lastName?.[0] || ""
              }`.toUpperCase(),

            companyName:
              customer.companyName,

            industry:
              customer.industry,

            email:
              customer.email,

            phone:
              customer.phone,

            jobTitle:
              customer.jobTitle,

            status:
              customer.status,

            accountManager:
              manager
                ? {
                    id:
                      manager._id,

                    name:
                      managerName ||
                      manager.email,

                    email:
                      manager.email,

                    jobTitle:
                      manager.jobTitle,
                  }
                : null,

            totalRevenue:
              customer.totalRevenue ||
              0,

            accountValue:
              customer.accountValue ||
              0,

            healthScore:
              customer.healthScore,

            healthStatus:
              customer.healthStatus,

            healthMessage:
              customer.healthMessage,

            lastContact:
              customer.lastActivityAt,

            lastActivityAt:
              customer.lastActivityAt,

            nextFollowUp:
              followUp
                ? {
                    id:
                      followUp._id,

                    title:
                      followUp.title,

                    dueAt:
                      followUp.dueAt,

                    status:
                      followUp.status,

                    priority:
                      followUp.priority,
                  }
                : null,

            createdAt:
              customer.createdAt,

            updatedAt:
              customer.updatedAt,
          };
        }
      );

    return res.status(200).json({
      success: true,

      message:
        "My customers fetched successfully.",

      data:
        formattedCustomers,

      pagination: {
        page:
          currentPage,

        limit:
          perPage,

        total:
          totalCustomers,

        totalPages,

        hasNextPage:
          currentPage <
          totalPages,

        hasPreviousPage:
          currentPage > 1,
      },
    });
  } catch (error) {
    console.error(
      "Get My Customers Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch my customers.",
    });
  }
};

// =====================================================
// GET CUSTOMER BY ID
// GET /api/customers/:id
//
// ADMIN:
//   Any company customer
//
// EMPLOYEE:
//   Only own assigned customer
// =====================================================

const getCustomerById = async (
  req,
  res
) => {
  try {
    const companyId =
      getCompanyId(req);

    const userId =
      getUserId(req);

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message:
          "Company information is missing.",
      });
    }

    const companyObjectId =
      getObjectId(companyId);

    const customerObjectId =
      getObjectId(
        req.params.id
      );

    if (!companyObjectId) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid company ID.",
      });
    }

    if (!customerObjectId) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid customer ID.",
      });
    }

    const query = {
      _id:
        customerObjectId,

      companyId:
        companyObjectId,
    };

    // Employee can only see assigned customer
    if (isEmployee(req)) {
      const userObjectId =
        getObjectId(userId);

      if (!userObjectId) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid employee ID.",
        });
      }

      query.accountManager =
        userObjectId;
    }

    const customer =
      await Customer.findOne(
        query
      )
        .populate(
          "accountManager",
          "firstName lastName email jobTitle phone"
        )
        .lean();

    if (!customer) {
      return res.status(404).json({
        success: false,
        message:
          "Customer not found.",
      });
    }

    // =================================================
    // ACTIVITIES
    // =================================================

    const activities =
      await CustomerActivity.find({
        companyId:
          companyObjectId,

        customerId:
          customerObjectId,
      })
        .populate(
          "userId",
          "firstName lastName email"
        )
        .sort({
          createdAt: -1,
        })
        .limit(20)
        .lean();

    // =================================================
    // FOLLOW-UPS
    // =================================================

    const followUpQuery = {
      companyId:
        companyObjectId,

      customerId:
        customerObjectId,

      status: {
        $in: [
          "Pending",
          "In Progress",
        ],
      },
    };

    if (isEmployee(req)) {
      followUpQuery.assignedTo =
        getObjectId(userId);
    }

    const followUps =
      await Task.find(
        followUpQuery
      )
        .sort({
          dueAt: 1,
        })
        .limit(20)
        .lean();

    return res.status(200).json({
      success: true,

      message:
        "Customer fetched successfully.",

      data: {
        customer,
        activities,
        followUps,
      },
    });
  } catch (error) {
    console.error(
      "Get Customer By ID Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch customer.",
    });
  }
};

// =====================================================
// EMPLOYEE CUSTOMER BY ID
// GET /api/customers/me/:id
// =====================================================

const getMyCustomerById =
  async (req, res) => {
    try {
      const companyId =
        getCompanyId(req);

      const userId =
        getUserId(req);

      if (
        !companyId ||
        !userId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "User or company information is missing.",
        });
      }

      const companyObjectId =
        getObjectId(companyId);

      const userObjectId =
        getObjectId(userId);

      const customerObjectId =
        getObjectId(
          req.params.id
        );

      if (
        !companyObjectId ||
        !userObjectId ||
        !customerObjectId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid customer information.",
        });
      }

      const customer =
        await Customer.findOne({
          _id:
            customerObjectId,

          companyId:
            companyObjectId,

          accountManager:
            userObjectId,
        })
          .populate(
            "accountManager",
            "firstName lastName email jobTitle phone"
          )
          .lean();

      if (!customer) {
        return res.status(404).json({
          success: false,
          message:
            "Customer not found.",
        });
      }

      const [
        activities,
        followUps,
      ] = await Promise.all([
        CustomerActivity.find({
          companyId:
            companyObjectId,

          customerId:
            customerObjectId,
        })
          .populate(
            "userId",
            "firstName lastName email"
          )
          .sort({
            createdAt: -1,
          })
          .limit(20)
          .lean(),

        Task.find({
          companyId:
            companyObjectId,

          assignedTo:
            userObjectId,

          customerId:
            customerObjectId,

          status: {
            $in: [
              "Pending",
              "In Progress",
            ],
          },
        })
          .sort({
            dueAt: 1,
          })
          .limit(20)
          .lean(),
      ]);

      return res.status(200).json({
        success: true,

        message:
          "My customer fetched successfully.",

        data: {
          customer,
          activities,
          followUps,
        },
      });
    } catch (error) {
      console.error(
        "Get My Customer By ID Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch my customer.",
      });
    }
  };

// =====================================================
// CREATE CUSTOMER
// POST /api/customers
//
// ADMIN:
//   Can assign customer to any active company user
//
// EMPLOYEE:
//   Customer automatically assigned to employee
// =====================================================

const createCustomer = async (
  req,
  res
) => {
  try {
    const companyId =
      getCompanyId(req);

    const userId =
      getUserId(req);

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message:
          "Company information is missing.",
      });
    }

    const companyObjectId =
      getObjectId(companyId);

    if (!companyObjectId) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid company ID.",
      });
    }

    const {
      firstName,
      lastName,
      companyName,
      industry,
      email,
      phone,
      jobTitle,
      status,
      accountManager,
      totalRevenue,
      accountValue,
      healthScore,
      healthStatus,
      healthMessage,
      notes,
    } = req.body;

    // =================================================
    // REQUIRED FIELDS
    // =================================================

    if (
      !firstName ||
      !lastName ||
      !companyName ||
      !email
    ) {
      return res.status(400).json({
        success: false,
        message:
          "First name, last name, company name and email are required.",
      });
    }

    const normalizedEmail =
      String(email)
        .trim()
        .toLowerCase();

    // =================================================
    // DUPLICATE EMAIL
    // =================================================

    const existingCustomer =
      await Customer.findOne({
        companyId:
          companyObjectId,

        email:
          normalizedEmail,
      });

    if (existingCustomer) {
      return res.status(409).json({
        success: false,
        message:
          "A customer with this email already exists.",
      });
    }

    // =================================================
    // ACCOUNT MANAGER
    // =================================================

    let managerId = null;

    // Employee automatically becomes manager
    if (isEmployee(req)) {
      managerId =
        getObjectId(userId);

      if (!managerId) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid employee ID.",
        });
      }

      const employee =
        await User.findOne({
          _id:
            managerId,

          companyId:
            companyObjectId,

          isActive:
            true,

          role:
            "employee",
        }).select("_id");

      if (!employee) {
        return res.status(403).json({
          success: false,
          message:
            "Employee account is not valid or inactive.",
        });
      }
    }

    // Admin can choose manager
    if (
      isAdmin(req) &&
      accountManager
    ) {
      managerId =
        getObjectId(
          accountManager
        );

      if (!managerId) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid account manager ID.",
        });
      }

      const manager =
        await User.findOne({
          _id:
            managerId,

          companyId:
            companyObjectId,

          isActive:
            true,
        }).select("_id");

      if (!manager) {
        return res.status(400).json({
          success: false,
          message:
            "Selected account manager does not belong to your company.",
        });
      }
    }

    // =================================================
    // CREATE CUSTOMER
    // =================================================

    const customer =
      await Customer.create({
        companyId:
          companyObjectId,

        firstName:
          String(firstName).trim(),

        lastName:
          String(lastName).trim(),

        companyName:
          String(companyName).trim(),

        industry:
          industry
            ? String(industry).trim()
            : null,

        email:
          normalizedEmail,

        phone:
          phone
            ? String(phone).trim()
            : null,

        jobTitle:
          jobTitle
            ? String(jobTitle).trim()
            : null,

        status:
          [
            "Active",
            "Pending",
            "Inactive",
          ].includes(status)
            ? status
            : "Active",

        accountManager:
          managerId,

        totalRevenue:
          Number(totalRevenue) >= 0
            ? Number(totalRevenue)
            : 0,

        accountValue:
          Number(accountValue) >= 0
            ? Number(accountValue)
            : 0,

        healthScore:
          Number(healthScore) >= 0 &&
          Number(healthScore) <= 100
            ? Number(healthScore)
            : 75,

        healthStatus:
          [
            "Healthy",
            "At Risk",
            "Expansion Opportunity",
            "Neutral",
          ].includes(
            healthStatus
          )
            ? healthStatus
            : "Healthy",

        healthMessage:
          healthMessage
            ? String(
                healthMessage
              ).trim()
            : null,

        notes:
          notes
            ? String(notes).trim()
            : null,

        lastActivityAt:
          new Date(),
      });

    // =================================================
    // CREATE ACTIVITY
    // =================================================

    await CustomerActivity.create({
      companyId:
        companyObjectId,

      customerId:
        customer._id,

      userId:
        userId || null,

      type:
        "other",

      title:
        "Customer created",

      description:
        `${customer.firstName} ${customer.lastName} was added as a customer.`,

      metadata: {
        source:
          "customer_creation",
      },
    });

    // =================================================
    // POPULATED RESPONSE
    // =================================================

    const populatedCustomer =
      await Customer.findById(
        customer._id
      )
        .populate(
          "accountManager",
          "firstName lastName email jobTitle"
        )
        .lean();

    return res.status(201).json({
      success: true,

      message:
        "Customer created successfully.",

      data:
        populatedCustomer,
    });
  } catch (error) {
    console.error(
      "Create Customer Error:",
      error
    );

    // Duplicate key
    if (
      error.code === 11000
    ) {
      return res.status(409).json({
        success: false,
        message:
          "A customer with this email already exists.",
      });
    }

    // Mongoose validation
    if (
      error.name ===
      "ValidationError"
    ) {
      const messages =
        Object.values(
          error.errors
        ).map(
          (item) =>
            item.message
        );

      return res.status(400).json({
        success: false,
        message:
          messages.join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to create customer.",
    });
  }
};

// =====================================================
// CUSTOMER HEALTH
// GET /api/customers/health
//
// ADMIN:
//   Company-wide health
//
// EMPLOYEE:
//   Own customer health
// =====================================================

const getCustomerHealth =
  async (req, res) => {
    try {
      const companyId =
        getCompanyId(req);

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message:
            "Company information is missing.",
        });
      }

      const companyObjectId =
        getObjectId(companyId);

      if (!companyObjectId) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid company ID.",
        });
      }

      const query = {
        companyId:
          companyObjectId,

        healthStatus: {
          $in: [
            "At Risk",
            "Expansion Opportunity",
          ],
        },
      };

      // Employee scope
      if (isEmployee(req)) {
        const userObjectId =
          getObjectId(
            getUserId(req)
          );

        if (!userObjectId) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid employee ID.",
          });
        }

        query.accountManager =
          userObjectId;
      }

      const customers =
        await Customer.find(
          query
        )
          .sort({
            healthScore: 1,
            updatedAt: -1,
          })
          .limit(10)
          .lean();

      const insights =
        customers.map(
          (customer) => {
            let message =
              customer.healthMessage;

            if (!message) {
              if (
                customer.healthStatus ===
                "At Risk"
              ) {
                message =
                  `Customer health score is ${customer.healthScore}/100. Review recent engagement and account activity.`;
              }

              if (
                customer.healthStatus ===
                "Expansion Opportunity"
              ) {
                message =
                  `Customer health score is ${customer.healthScore}/100. This account may have expansion potential.`;
              }
            }

            return {
              id:
                customer._id,

              customerId:
                customer._id,

              customerName:
                `${customer.firstName || ""} ${
                  customer.lastName || ""
                }`.trim(),

              companyName:
                customer.companyName,

              healthScore:
                customer.healthScore,

              healthStatus:
                customer.healthStatus,

              message,

              healthMessage:
                customer.healthMessage,

              accountValue:
                customer.accountValue,

              totalRevenue:
                customer.totalRevenue,

              lastActivityAt:
                customer.lastActivityAt,

              createdAt:
                customer.createdAt,

              updatedAt:
                customer.updatedAt,
            };
          }
        );

      return res.status(200).json({
        success: true,

        message:
          "Customer health insights fetched successfully.",

        data:
          insights,
      });
    } catch (error) {
      console.error(
        "Get Customer Health Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch customer health insights.",
      });
    }
  };

// =====================================================
// RECENT CUSTOMER ACTIVITY
// GET /api/customers/activity
//
// ADMIN:
//   Company-wide
//
// EMPLOYEE:
//   Own customer activity
// =====================================================

const getRecentCustomerActivity =
  async (req, res) => {
    try {
      const companyId =
        getCompanyId(req);

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message:
            "Company information is missing.",
        });
      }

      const companyObjectId =
        getObjectId(companyId);

      if (!companyObjectId) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid company ID.",
        });
      }

      const limit =
        Math.min(
          Math.max(
            Number(
              req.query.limit
            ) || 10,
            1
          ),
          50
        );

      // =================================================
      // EMPLOYEE CUSTOMER IDs
      // =================================================

      let customerFilter = {
        companyId:
          companyObjectId,
      };

      if (isEmployee(req)) {
        const userObjectId =
          getObjectId(
            getUserId(req)
          );

        if (!userObjectId) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid employee ID.",
          });
        }

        customerFilter.accountManager =
          userObjectId;
      }

      const customers =
        await Customer.find(
          customerFilter
        )
          .select("_id")
          .lean();

      const customerIds =
        customers.map(
          (customer) =>
            customer._id
        );

      if (
        customerIds.length === 0
      ) {
        return res.status(200).json({
          success: true,

          message:
            "No customer activity found.",

          data: [],
        });
      }

      // =================================================
      // ACTIVITIES
      // =================================================

      const activities =
        await CustomerActivity.find({
          companyId:
            companyObjectId,

          customerId: {
            $in:
              customerIds,
          },
        })
          .populate(
            "customerId",
            "firstName lastName companyName email"
          )
          .populate(
            "userId",
            "firstName lastName email"
          )
          .sort({
            createdAt: -1,
          })
          .limit(limit)
          .lean();

      const formattedActivities =
        activities.map(
          (activity) => {
            const customer =
              activity.customerId;

            const user =
              activity.userId;

            return {
              id:
                activity._id,

              type:
                activity.type,

              title:
                activity.title,

              description:
                activity.description,

              createdAt:
                activity.createdAt,

              updatedAt:
                activity.updatedAt,

              customer:
                customer
                  ? {
                      id:
                        customer._id,

                      name:
                        `${customer.firstName || ""} ${
                          customer.lastName || ""
                        }`.trim(),

                      companyName:
                        customer.companyName,

                      email:
                        customer.email,
                    }
                  : null,

              user:
                user
                  ? {
                      id:
                        user._id,

                      name:
                        `${user.firstName || ""} ${
                          user.lastName || ""
                        }`.trim(),

                      email:
                        user.email,
                    }
                  : null,

              metadata:
                activity.metadata,
            };
          }
        );

      return res.status(200).json({
        success: true,

        message:
          "Recent customer activity fetched successfully.",

        data:
          formattedActivities,
      });
    } catch (error) {
      console.error(
        "Get Recent Customer Activity Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch recent customer activity.",
      });
    }
  };

// =====================================================
// EMPLOYEE CUSTOMER ACTIVITY
// GET /api/customers/me/activity
// =====================================================

const getMyCustomerActivity =
  async (req, res) => {
    try {
      const companyId =
        getCompanyId(req);

      const userId =
        getUserId(req);

      if (
        !companyId ||
        !userId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "User or company information is missing.",
        });
      }

      const companyObjectId =
        getObjectId(companyId);

      const userObjectId =
        getObjectId(userId);

      if (
        !companyObjectId ||
        !userObjectId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid user or company ID.",
        });
      }

      const limit =
        Math.min(
          Math.max(
            Number(
              req.query.limit
            ) || 10,
            1
          ),
          50
        );

      const customers =
        await Customer.find({
          companyId:
            companyObjectId,

          accountManager:
            userObjectId,
        })
          .select("_id")
          .lean();

      const customerIds =
        customers.map(
          (customer) =>
            customer._id
        );

      if (
        customerIds.length === 0
      ) {
        return res.status(200).json({
          success: true,

          message:
            "No customer activity found.",

          data: [],
        });
      }

      const activities =
        await CustomerActivity.find({
          companyId:
            companyObjectId,

          customerId: {
            $in:
              customerIds,
          },
        })
          .populate(
            "customerId",
            "firstName lastName companyName email"
          )
          .populate(
            "userId",
            "firstName lastName email"
          )
          .sort({
            createdAt: -1,
          })
          .limit(limit)
          .lean();

      const formattedActivities =
        activities.map(
          (activity) => {
            const customer =
              activity.customerId;

            const user =
              activity.userId;

            return {
              id:
                activity._id,

              type:
                activity.type,

              title:
                activity.title,

              description:
                activity.description,

              createdAt:
                activity.createdAt,

              updatedAt:
                activity.updatedAt,

              customer:
                customer
                  ? {
                      id:
                        customer._id,

                      name:
                        `${customer.firstName || ""} ${
                          customer.lastName || ""
                        }`.trim(),

                      companyName:
                        customer.companyName,

                      email:
                        customer.email,
                    }
                  : null,

              user:
                user
                  ? {
                      id:
                        user._id,

                      name:
                        `${user.firstName || ""} ${
                          user.lastName || ""
                        }`.trim(),

                      email:
                        user.email,
                    }
                  : null,

              metadata:
                activity.metadata,
            };
          }
        );

      return res.status(200).json({
        success: true,

        message:
          "My customer activity fetched successfully.",

        data:
          formattedActivities,
      });
    } catch (error) {
      console.error(
        "Get My Customer Activity Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch my customer activity.",
      });
    }
  };

// =====================================================
// EMPLOYEE UPCOMING FOLLOW-UPS
// GET /api/customers/me/follow-ups
// =====================================================

const getMyUpcomingFollowUps =
  async (req, res) => {
    try {
      const companyId =
        getCompanyId(req);

      const userId =
        getUserId(req);

      if (
        !companyId ||
        !userId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "User or company information is missing.",
        });
      }

      const companyObjectId =
        getObjectId(companyId);

      const userObjectId =
        getObjectId(userId);

      if (
        !companyObjectId ||
        !userObjectId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid user or company ID.",
        });
      }

      const limit =
        Math.min(
          Math.max(
            Number(
              req.query.limit
            ) || 5,
            1
          ),
          20
        );

      const startOfToday =
        getStartOfToday();

      const followUps =
        await Task.find({
          companyId:
            companyObjectId,

          assignedTo:
            userObjectId,

          customerId: {
            $ne: null,
          },

          status: {
            $in: [
              "Pending",
              "In Progress",
            ],
          },

          dueAt: {
            $gte:
              startOfToday,
          },
        })
          .populate(
            "customerId",
            "firstName lastName companyName email phone"
          )
          .sort({
            dueAt: 1,
          })
          .limit(limit)
          .lean();

      const formattedFollowUps =
        followUps.map(
          (task) => {
            const customer =
              task.customerId;

            return {
              id:
                task._id,

              title:
                task.title,

              description:
                task.description,

              dueAt:
                task.dueAt,

              status:
                task.status,

              priority:
                task.priority,

              customer:
                customer
                  ? {
                      id:
                        customer._id,

                      name:
                        `${customer.firstName || ""} ${
                          customer.lastName || ""
                        }`.trim(),

                      companyName:
                        customer.companyName,

                      email:
                        customer.email,

                      phone:
                        customer.phone,
                    }
                  : null,
            };
          }
        );

      return res.status(200).json({
        success: true,

        message:
          "Upcoming follow-ups fetched successfully.",

        data:
          formattedFollowUps,
      });
    } catch (error) {
      console.error(
        "Get My Upcoming Follow-Ups Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch upcoming follow-ups.",
      });
    }
  };

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  // Existing customer APIs
  getCustomerStats,
  getCustomers,
  getCustomerById,
  createCustomer,
  getCustomerHealth,
  getRecentCustomerActivity,

  // Employee customer APIs
  getMyCustomerStats,
  getMyCustomers,
  getMyCustomerById,
  getMyCustomerActivity,
  getMyUpcomingFollowUps,
};