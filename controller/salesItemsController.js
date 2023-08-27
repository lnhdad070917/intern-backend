import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getSalesItem = async (req, res) => {
  try {
    const response = await prisma.sales.findMany();

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getSalesItembyId = async (req, res) => {
  try {
    const response = await prisma.sales.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!response) {
      return res.status(404).json({ msg: "Sales not found" });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const postSalesItem = async (req, res) => {
  const salesItemData = req.body;

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: salesItemData.id_product,
      },
    });

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    if (product.stock < salesItemData.qty) {
      return res.status(400).json({ msg: "Not enough stock available" });
    }

    const totalPrice = product.price * salesItemData.qty;

    const response = await prisma.$transaction(async (prisma) => {
      const createdSalesItem = await prisma.sales_Item.create({
        data: salesItemData,
      });

      await prisma.product.update({
        where: { id: product.id },
        data: {
          stock: product.stock - salesItemData.qty,
        },
      });

      const updatedSales = await prisma.sales.update({
        where: { id: salesItemData.id_sales },
        data: {
          price: {
            increment: totalPrice,
          },
        },
      });

      return { salesItem: createdSalesItem, updatedSales };
    });

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createSalesItem = async (req, res) => {
  const salesItemsData = req.body;

  try {
    const response = await prisma.$transaction(async (prisma) => {
      const lastSales = await prisma.sales.findFirst({
        orderBy: [{ id: "desc" }],
      });

      let newCode = "Inv1";
      if (lastSales) {
        const lastCode = lastSales.no_invoice;
        const numericPart = parseInt(lastCode.slice(3));
        const newNumericPart = numericPart + 1;
        newCode = `Inv${newNumericPart}`;
      }

      const newSales = await prisma.sales.create({
        data: {
          no_invoice: newCode,
          code_status: 1,
          id_customer: salesItemsData[0].id_customer, // Assuming the first sales item's customer ID is used
          delivery_name: "JNE",
          delivery_cost: 7000,
          total_pay: 0, // Placeholder for now
          price: 0, // Placeholder for now
        },
      });

      const createdSalesItems = [];

      for (const salesItemData of salesItemsData) {
        const product = await prisma.product.findUnique({
          where: {
            id: salesItemData.id_product,
          },
        });

        if (!product) {
          return res.status(404).json({ msg: "Product not found" });
        }

        if (product.stock < salesItemData.qty) {
          return res.status(400).json({ msg: "Not enough stock available" });
        }

        const createdSalesItem = await prisma.sales_Item.create({
          data: {
            ...salesItemData,
            id_sales: newSales.id,
          },
        });

        await prisma.product.update({
          where: { id: product.id },
          data: {
            stock: product.stock - salesItemData.qty,
          },
        });

        createdSalesItems.push(createdSalesItem);
      }

      // Calculate total price for all created sales items
      const totalItemsPrice = createdSalesItems.reduce(
        (total, item) => total + item.price * item.qty,
        0
      );

      // Update total price and total_pay in the new sales
      const updatedSales = await prisma.sales.update({
        where: { id: newSales.id },
        data: {
          price: totalItemsPrice,
          total_pay: totalItemsPrice + 7000,
        },
      });

      return { salesItems: createdSalesItems, newSales: updatedSales };
    });

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateSalesItem = async (req, res) => {
  const salesItemId = Number(req.params.id);
  const updatedSalesItemData = req.body;

  try {
    const existingSalesItem = await prisma.sales_Item.findUnique({
      where: { id: salesItemId },
      include: {
        product: true,
      },
    });

    if (!existingSalesItem) {
      return res.status(404).json({ msg: "Sales item not found" });
    }

    const product = existingSalesItem.product;

    const stockDifference = existingSalesItem.qty - updatedSalesItemData.qty;
    if (stockDifference > product.stock) {
      return res.status(400).json({ msg: "Not enough stock available" });
    }

    const totalPriceDifference =
      existingSalesItem.price * existingSalesItem.qty -
      updatedSalesItemData.price * updatedSalesItemData.qty;

    const response = await prisma.$transaction(async (prisma) => {
      const updatedSalesItem = await prisma.sales_Item.update({
        where: { id: salesItemId },
        data: updatedSalesItemData,
      });

      await prisma.product.update({
        where: { id: product.id },
        data: {
          stock: product.stock + stockDifference,
        },
      });

      const salesId = existingSalesItem.id_sales;
      const updatedSales = await prisma.sales.update({
        where: { id: salesId },
        data: {
          price: {
            increment: totalPriceDifference,
          },
        },
      });

      return { updatedSalesItem, updatedSales };
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteSalesItem = async (req, res) => {
  try {
    const response = await prisma.sales.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getSalesItemBySalesId = async (req, res) => {
  try {
    const response = await prisma.sales_Item.findMany({
      where: {
        id_sales: Number(req.params.id),
      },
      include: {
        product: true,
        customer: true,
      },
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
