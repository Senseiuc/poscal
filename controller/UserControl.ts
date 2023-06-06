// This class handles various operations related to User management
import { db } from "../utils/db.server";
import { Request, Response } from "express";
import { PoscalBaseController, SUPERADMIN, ADMIN } from "./PoscalBaseController";
import { User } from "@prisma/client";

class UserControl extends PoscalBaseController {
  constructor() {
    super();
  }

  async create(req: Request, res: Response) {
    const { email, username, password, roleID } = req.body;

    try {
      const currentUser = await this.getCurrentUser(req); // Get the current user from the request

      // Check if the current user has the superadmin role or admin role
      if (this.checkRole(currentUser, [SUPERADMIN, ADMIN])) {
        const user = await db.user.create({
          data: {
            email,
            username,
            password: Buffer.from(password, "utf8").toString("base64"),
            role: {
              connect: {
                id: parseInt(roleID),
              },
            },
          },
        });

        return res.status(201).json({
          statusCode: 201,
          success: true,
          message: "User created successfully",
          data: user,
        });
      } else {
        return res.status(403).json({
          statusCode: 403,
          success: false,
          message: "You are not authorized to create a user",
        });
      }
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: "Something went wrong",
        success: false,
        error: error.message,
      });
    }
  }

  async fetchUser(req: Request, res: Response) {
    const { userID } = req.params;

    try {
      const currentUser = await this.getCurrentUser(req); // Get the current user from the request

      // Check if the current user has the superadmin role, admin role, or is the same user
      if (this.checkRole(currentUser, [SUPERADMIN, ADMIN]) || currentUser.id === parseInt(userID)) {
        const user = await db.user.findUnique({
          where: {
            id: parseInt(userID),
          },
          select: {
            id: true,
            username: true,
            email: true,
            roleID: true,
            role: true,
          },
        });

        if (user) {
          return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "User details fetched successfully",
            data: user,
          });
        } else {
          return res.status(404).json({
            statusCode: 404,
            success: false,
            message: "User not found",
          });
        }
      } else {
        return res.status(401).json({
          statusCode: 401,
          success: false,
          message: "You are not authorized to fetch user details",
        });
      }
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: "Something went wrong",
        success: false,
        error: error.message,
      });
    }
  }

  async updateUser(req: Request, res: Response) {
    const { userID } = req.params;
    const { username, password, roleID, email } = req.body;

    try {
      const currentUser = await this.getCurrentUser(req); // Get the current user from the request

      // Check if the current user has the superadmin role, admin role, or is the same user
      if (this.checkRole(currentUser, [SUPERADMIN, ADMIN]) || currentUser.id === parseInt(userID)) {
        const userData: Partial<User> = {};

        if (username) userData.username = username;
        if (password) userData.password = Buffer.from(password, "utf8").toString("base64");
        if (roleID) userData.roleID = parseInt(roleID);
        if (email) userData.email = email;

        const updatedUser = await db.user.update({
          where: {
            id: parseInt(userID),
          },
          data: userData,
          select: {
            id: true,
            username: true,
            email: true,
            roleID: true,
            role: true,
          },
        });

        if (updatedUser) {
          return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "User details updated successfully",
            data: updatedUser,
          });
        } else {
          return res.status(404).json({
            statusCode: 404,
            success: false,
            message: "User not found",
          });
        }
      } else {
        return res.status(401).json({
          statusCode: 401,
          success: false,
          message: "You are not authorized to update user details",
        });
      }
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: "Something went wrong",
        success: false,
        error: error.message,
      });
    }
  }

  async deleteUser(req: Request, res: Response) {
    const { userID } = req.params;

    try {
      const currentUser = await this.getCurrentUser(req); // Get the current user from the request

      // Check if the current user has the superadmin role or admin role
      if (this.checkRole(currentUser, [SUPERADMIN, ADMIN])) {
        const deletedUser = await db.user.delete({
          where: {
            id: parseInt(userID),
          },
        });

        if (deletedUser) {
          return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "User deleted successfully",
          });
        } else {
          return res.status(404).json({
            statusCode: 404,
            success: false,
            message: "User not found",
          });
        }
      } else {
        return res.status(401).json({
          statusCode: 401,
          success: false,
          message: "You are not authorized to delete user",
        });
      }
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: "Something went wrong",
        success: false,
        error: error.message,
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const currentUser = await this.getCurrentUser(req); // Get the current user from the request

      // Check if the current user has the superadmin role or admin role
      if (this.checkRole(currentUser, [SUPERADMIN, ADMIN])) {
        const users = await db.user.findMany({
          include: {
            role: true,
          },
          select: {
            id: true,
            username: true,
            email: true,
            roleID: true,
            role: true,
          },
        });

        return res.status(200).json({
          statusCode: 200,
          success: true,
          message: "Users fetched successfully",
          users,
        });
      } else {
        return res.status(401).json({
          statusCode: 401,
          success: false,
          message: "You are not authorized to fetch all users",
        });
      }
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: "Something went wrong",
        success: false,
        error: error.message,
      });
    }
  }
}

const userControl = new UserControl();
export default userControl;

