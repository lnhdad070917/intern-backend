import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getStatus = async (req, res) => {
  try {
    const response = await prisma.status.findMany();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getStatusbyId = async (req, res) => {
  try {
    const response = await prisma.status.findUnique({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const postStatus = async (req, res) => {
  const statusData = req.body;

  try {
    const existingStatus = await prisma.status.findFirst({
      where: {
        code: statusData.code,
      },
    });

    if (existingStatus) {
      return res.status(400).json({ msg: "Code already exists" });
    }

    const response = await prisma.status.create({ data: req.body });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateStatus = async (req, res) => {
  const statusData = req.body;

  try {
    const existingStatus = await prisma.status.findFirst({
      where: {
        code: statusData.code,
      },
    });

    if (existingStatus) {
      return res.status(400).json({ msg: "Code already exists" });
    }

    const response = await prisma.status.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        code: statusData.code,
        label: statusData.label,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteStatus = async (req, res) => {
  try {
    const response = await prisma.status.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
