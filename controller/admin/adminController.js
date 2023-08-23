import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";

export const getAdmin = async (req, res) => {
  try {
    const response = await prisma.admin.findMany();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getAdminbyId = async (req, res) => {
  try {
    const response = await prisma.admin.findUnique({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const postAdmin = async (req, res) => {
  const adminData = req.body;
  try {
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        username: adminData.username,
      },
    });

    if (existingAdmin) {
      return res.status(400).json({ msg: "Username already exists" });
    }

    const hashedPassword = bcrypt.hashSync(adminData.password, 12);
    const response = await prisma.admin.create({
      data: { ...adminData, password: hashedPassword },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateAdmin = async (req, res) => {
  const adminData = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(adminData.password, 12);
    const response = await prisma.admin.update({
      where: {
        id: Number(req.params.id),
      },
      data: { ...adminData, password: hashedPassword },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const response = await prisma.admin.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
