// Methods for creating a new role, updating a role , deleting a role
// fetching a role, fetching all roles, adding a permission to a role and 
// removing a permission from a role
import { Request, Response } from "express";
import PoscalBaseController from "./PoscalBaseController";
import { db } from "../utils/db.server";
import { Role, RolePermissions } from "@prisma/client";

class PoscalRole-based_accesscontrol extends BaseController {
  constructor() {
    super();
  }

  async createRole(req: Request, res: Response) {
    try {
      const { uname } = req.body;
      const user = await db.user.findUnique({ where: { username: uname } });
      const permission = await db.rolePermissions.findFirst({ where: { roleID: user?.roleID, permissionID: 5 } });

      if (permission) {
        const { name } = req.body;

        if (name) {
          const role = await db.role.create({
            data: {
              name,
            },
          });

          return res.status(201).json({
            message: "Role created successfully",
            role,
          });
        }
      }

      return res.status(403).json({
        message: "You don't have the right to create a role",
      });
    } catch (err) {
      return res.status(500).json({
        message: "Something went wrong",
        err,
      });
    }
  }

  async updateRole(req: Request, res: Response) {
    try {
      const { uname } = req.body;
      const user = await db.user.findUnique({ where: { username: uname } });
      const permission = await db.rolePermissions.findFirst({ where: { roleID: user?.roleID, permissionID: 7 } });

      if (permission) {
        const { roleID } = req.params;

        if (roleID) {
          const role = await db.role.findUnique({
            where: {
              id: parseInt(roleID),
            },
          });

          if (role) {
            const { name } = req.body;

            if (name) {
              const updatedRole = await db.role.update({
                where: {
                  id: parseInt(roleID),
                },
                data: {
                  name,
                },
              });

              return res.status(200).json({
                message: "Role updated successfully",
                role: updatedRole,
              });
            }
          } else {
            return res.status(404).json({
              message: "Role not found",
            });
          }
        }
      }

      return res.status(403).json({
        message: "You don't have the right to update a role",
      });
    } catch (err) {
      return res.status(500).json({
        message: "Something went wrong",
        err,
      });
    }
  }

  async deleteRole(req: Request, res: Response) {
    try {
      const { uname } = req.body;
      const user = await db.user.findUnique({ where: { username: uname } });
      const permission = await db.rolePermissions.findFirst({ where: { roleID: user?.roleID, permissionID: 8 } });

      if (permission) {
        const { roleID } = req.params;

        if (roleID) {
          const role = await db.role.findUnique({
            where: {
              id: parseInt(roleID),
            },
          });

	            if (role) {
            const rolePermissions = await db.rolePermissions.findMany({
              where: {
                roleID: parseInt(roleID),
              },
            });

            await db.rolePermissions.deleteMany({
              where: {
                roleID: parseInt(roleID),
              },
            });

            await db.role.delete({
              where: {
                id: parseInt(roleID),
              },
            });

            return res.status(200).json({
              message: "Role deleted successfully",
              role,
              rolePermissions,
            });
          } else {
            return res.status(404).json({
              message: "Role not found",
            });
          }
        }
      }

      return res.status(403).json({
        message: "You don't have the right to delete a role",
      });
    } catch (err) {
      return res.status(500).json({
        message: "Something went wrong",
        err,
      });
    }
  }

  async fetchRole(req: Request, res: Response) {
    try {
      const { roleID } = req.params;

      if (roleID) {
        const role = await db.role.findUnique({
          where: {
            id: parseInt(roleID),
          },
        });

        if (role) {
          return res.status(200).json({
            message: "Role fetched successfully",
            role,
          });
        } else {
          return res.status(404).json({
            message: "Role not found",
          });
        }
      }
    } catch (err) {
      return res.status(500).json({
        message: "Something went wrong",
        err,
      });
    }
  }

  async fetchAllRoles(req: Request, res: Response) {
    try {
      const roles = await db.role.findMany();

      return res.status(200).json({
        message: "Roles fetched successfully",
        roles,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Something went wrong",
        err,
      });
    }
  }

  async addPermissionToRole(req: Request, res: Response) {
    try {
      const { uname } = req.body;
      const user = await db.user.findUnique({ where: { username: uname } });
      const permission = await db.rolePermissions.findFirst({ where: { roleID: user?.roleID, permissionID: 9 } });

      if (permission) {
        const { roleID } = req.params;
        const { permissionID } = req.body;

        if (roleID && permissionID) {
          const role = await db.role.findUnique({
            where: {
              id: parseInt(roleID),
            },
          });

          if (role) {
            const newRolePermission = await db.rolePermissions.create({
              data: {
                roleID: parseInt(roleID),
                permissionID: parseInt(permissionID),
              },
            });

            return res.status(200).json({
              message: "Permission added to role successfully",
              rolePermission: newRolePermission,
            });
          } else {
            return res.status(404).json({
              message: "Role not found",
            });
          }
        }
      }

      return res.status(403).json({
        message: "You don't have the right to add a permission to a role",
      });
    } catch (err) {
      return res.status(500).json

        async removePermissionFromRole(req: Request, res: Response) {
    try {
      const { uname } = req.body;
      const user = await db.user.findUnique({ where: { username: uname } });
      const permission = await db.rolePermissions.findFirst({ where: { roleID: user?.roleID, permissionID: 9 } });

      if (permission) {
        const { roleID, permissionID } = req.params;

        if (roleID && permissionID) {
          const role = await db.role.findUnique({
            where: {
              id: parseInt(roleID),
            },
          });

          if (role) {
            const deletedRolePermission = await db.rolePermissions.delete({
              where: {
                roleID: parseInt(roleID),
                permissionID: parseInt(permissionID),
              },
            });

            if (deletedRolePermission) {
              return res.status(200).json({
                message: "Permission removed from role successfully",
                rolePermission: deletedRolePermission,
              });
            } else {
              return res.status(404).json({
                message: "Role permission not found",
              });
            }
          } else {
            return res.status(404).json({
              message: "Role not found",
            });
          }
        }
      }

      return res.status(403).json({
        message: "You don't have the right to remove a permission from a role",
      });
    } catch (err) {
      return res.status(500).json({
        message: "Something went wrong",
        err,
      });
    }
  }
}

const Poscalrole-based_accesscontrol = new PoscalRole-based_accesscontrol();

export default PoscalRole-based_accesscontrol;
