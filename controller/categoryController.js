import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getCategory = async (req, res) => {
  try {
    const response = await prisma.category.findMany();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.msg });
  }
};

export const getCategorybyId = async (req, res) => {
  try {
    const response = await prisma.category.findUnique({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.msg });
  }
};

export const postCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const category = await prisma.category.create({ data: { name: name } });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ msg: error.msg });
  }
};

export const updateCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const category = await prisma.category.update({
      where: {
        id: Number(req.params.id),
      },
      data: { name: name },
    });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ msg: error.msg });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await prisma.category.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ msg: error.msg });
  }
};
