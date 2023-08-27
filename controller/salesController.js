import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getSales = async (req, res) => {
  try {
    const response = await prisma.sales.findMany({
      include: {
        customer: true,
        sales_item: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    const statusResponse = await prisma.status.findMany();

    const statusMapping = {};
    for (const status of statusResponse) {
      statusMapping[status.code] = status.label;
    }

    const enrichedResponse = response.map((sale) => {
      const codeStatus = sale.code_status;
      const status_name =
        statusMapping[codeStatus] || "Status tidak terdefinisi";
      return { ...sale, status_name };
    });

    res.status(200).json(enrichedResponse);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getSalesbyId = async (req, res) => {
  try {
    const response = await prisma.sales.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        customer: true,
        sales_item: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    const statusResponse = await prisma.status.findMany();

    const statusMapping = {};
    for (const status of statusResponse) {
      statusMapping[status.code] = status.label;
    }

    const codeStatus = response.code_status;
    const status_name = statusMapping[codeStatus] || "Status tidak terdefinisi";

    const enrichedResponse = {
      ...response,
      status_name,
    };

    res.status(200).json(enrichedResponse);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getSalesbyInvoice = async (req, res) => {
  try {
    const { query } = req.query;

    const sales = await prisma.sales.findFirst({
      where: {
        no_invoice: {
          equals: query,
        },
      },
      include: {
        customer: true,
        sales_item: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!sales) {
      res.status(404).json({ msg: "Invoice not found" });
      return;
    }

    const statusResponse = await prisma.status.findMany();

    const statusMapping = {};
    for (const status of statusResponse) {
      statusMapping[status.code] = status.label;
    }

    const codeStatus = sales.code_status;
    const status_name = statusMapping[codeStatus] || "Status tidak terdefinisi";

    const product = sales.sales_item.map((item) => {
      const productData = { ...item.product };
      if (productData.img) {
        productData.img = `http://localhost:2000/public/img/${productData.img}`;
      }
      return productData;
    });

    const salesWithUpdatedProduct = {
      ...sales,
      status_name, // Menambahkan status_name
      sales_item: product,
    };

    res.status(200).json(salesWithUpdatedProduct);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const postSales = async (req, res) => {
  const salesData = req.body;

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

      const createdSales = await prisma.sales.create({
        data: {
          ...salesData,
          no_invoice: newCode,
        },
      });

      return createdSales;
    });

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateSales = async (req, res) => {
  const salesData = req.body;
  try {
    const response = await prisma.sales.update({
      where: {
        id: Number(req.params.id),
      },
      data: salesData,
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteSales = async (req, res) => {
  const salesId = Number(req.params.id);

  try {
    const sales = await prisma.sales.findUnique({
      where: {
        id: salesId,
      },
      include: {
        sales_item: true,
      },
    });

    if (!sales) {
      return res.status(404).json({ msg: "Sales not found" });
    }

    const salesItemIds = sales.sales_item.map((item) => item.id);

    await prisma.sales_Item.deleteMany({
      where: {
        id: {
          in: salesItemIds,
        },
      },
    });

    await prisma.sales.delete({
      where: {
        id: salesId,
      },
    });

    res
      .status(200)
      .json({ msg: "Sales and associated sales items deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
