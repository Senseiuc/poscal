// To create a new inventory item
// To fetch all inventory items
// To update, delete and reduce the inventory item
import { Request, Response } from "express";
import { db } from "../utils/db.server";

class PoscalInventoryController {
  async create(req: Request, res: Response) {
    const { uname, name, description, quantity } = req.body;
    if (!uname || !name || !quantity) {
      return res.status(400).send("Missing information");
    }

    const user = await db.user.findUnique({ where: { username: uname } });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const permission = await db.rolePermissions.findFirst({
      where: { roleID: user.roleID, permissionID: [9, 11, 12, 13, 14] },
    });

    if (!permission) {
      return res.status(401).send("Unauthorized");
    }

    try {
      const newItem = await db.inventory.create({
        data: {
          name,
          description,
          quantity: parseInt(quantity),
        },
      });

      return res.status(201).json({
        message: "Inventory item created successfully",
        newItem,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create inventory item" });
    }
  }

  async updateItem(req: Request, res: Response) {
    const { uname, itemID, name, description, quantity } = req.body;
    if (!uname || !itemID) {
      return res.status(400).send("Missing information");
    }

    const user = await db.user.findUnique({ where: { username: uname } });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const permission = await db.rolePermissions.findFirst({
      where: { roleID: user.roleID, permissionID: [9, 11, 12, 13, 14] },
    });

    if (!permission) {
      return res.status(401).send("Unauthorized");
    }

    try {
      const item = await db.inventory.findUnique({ where: { id: parseInt(itemID) } });
      if (!item) {
        return res.status(404).send("Item not found");
      }

      const updatedItem = await db.inventory.update({
        where: { id: parseInt(itemID) },
        data: {
          name: name || item.name,
          description: description || item.description,
          quantity: quantity ? parseInt(quantity) : item.quantity,
        },
      });

      return res.status(200).json({
        message: "Inventory item updated successfully",
        inventory: updatedItem,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update inventory" });
    }
  }

  async fetchInventory(req: Request, res: Response) {
    const { uname } = req.body;
    if (!uname) {
      return res.status(400).send("Missing information");
    }

    const user = await db.user.findUnique({ where: { username: uname } });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const permission = await db.rolePermissions.findFirst({
      where: { roleID: user.roleID, permissionID: [9, 10, 11, 12, 13, 14] },
    });

    if (!permission) {
      return res.status(401).send("Unauthorized");
    }

    try {
      const inventory = await db.inventory.findMany();
      if (inventory.length === 0) {
        return res.status(404).send("No inventory items found");
      }

      return res.status(200).json({ inventory });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch inventory" });
    }
  }

  async deleteItem(req: Request, res: Response) {
    const { uname, itemID } = req.body;
    if (!uname || !itemID) {
      return res.status(400).send("Missing information");
    }

    const user = await db.user.findUnique({ where: { username: uname } });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const permission = await db.rolePermissions.findFirst({
      where: { roleID: user.roleID, permissionID: [9, 11, 12, 13, 14] },
    });

    if (!permission) {
      return res.status(401).send("Unauthorized");
    }

    try {
      const item = await db.inventory.findUnique({ where: { id: parseInt(itemID) } });
      if (!item) {
        return res.status(404).send("Item not found");
      }

      await db.inventory.delete({ where: { id: parseInt(itemID) } });

      return res.status(200).json({ message: "Inventory item deleted successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to delete inventory item" });
    }
  }

  async sellItem(req: Request, res: Response) {
    const { uname, itemID, quantity } = req.body;
    if (!uname || !itemID || !quantity) {
      return res.status(400).send("Missing information");
    }

    const user = await db.user.findUnique({ where: { username: uname } });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const permission = await db.rolePermissions.findFirst({
      where: { roleID: user.roleID, permissionID: [9, 11, 12, 13, 14] },
    });

    if (!permission) {
      return res.status(401).send("Unauthorized");
    }

    try {
      const item = await db.inventory.findUnique({ where: { id: parseInt(itemID) } });
      if (!item) {
        return res.status(404).send("Item not found");
      }

      const availableQuantity = item.quantity;
      if (quantity > availableQuantity) {
        return res.status(400).send("Insufficient quantity");
      }

      const updatedItem = await db.inventory.update({
        where: { id: parseInt(itemID) },
        data: { quantity: availableQuantity - quantity },
      });

      return res.status(200).json({
        message: "Item sold successfully",
        inventory: updatedItem,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to sell item" });
    }
  }

  async fetchItem(req: Request, res: Response) {
    const { uname, itemID } = req.body;
    if (!uname || !itemID) {
      return res.status(400).send("Missing information");
    }

    const user = await db.user.findUnique({ where: { username: uname } });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const permission = await db.rolePermissions.findFirst({
      where: { roleID: user.roleID, permissionID: [9, 10, 11, 12, 13, 14] },
    });

    if (!permission) {
      return res.status(401).send("Unauthorized");
    }

    try {
      const item = await db.inventory.findUnique({ where: { id: parseInt(itemID) } });
      if (!item) {
        return res.status(404).send("Item not found");
      }

      return res.status(200).json({ item });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch item" });
    }
  }
}

export const PoscalinventoryController = new PoscalInventoryController();

