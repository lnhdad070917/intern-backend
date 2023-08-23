import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getSalesItem = async (req, res) => {
  try {
    const response = await prisma.sales_Item.findMany({
      include: {
        product: true,
        customer: true,
      },
    });

    const formattedResponse = response.map((item) => ({
      id: item.id,
      id_product: item.id_product,
      price: item.price,
      qty: item.qty,
      id_customer: item.id_customer,
      ket: item.ket,
      product: item.product,
      customer: item.customer,
    }));

    res.status(200).json(formattedResponse);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getSalesItembyId = async (req, res) => {
  try {
    const response = await prisma.sales_Item.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        product: true,
        customer: true,
      },
    });

    if (!response) {
      return res.status(404).json({ msg: "Sales item not found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const postSalesItem = async (req, res) => {
  try {
    const response = await prisma.sales_Item.create({ data: req.body });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateSalesItem = async (req, res) => {
  try {
    const response = await prisma.sales_Item.update({
      where: {
        id: Number(req.params.id),
      },
      data: req.body,
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteSalesItem = async (req, res) => {
  try {
    const response = await prisma.sales_Item.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
