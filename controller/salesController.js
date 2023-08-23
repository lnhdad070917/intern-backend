import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getSales = async (req, res) => {
  try {
    const response = await prisma.sales.findMany({
      include: {
        sales_item: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
            customer: true,
          },
        },
      },
    });

    const statusResponse = await prisma.status.findMany();

    const statusMapping = {};
    for (const status of statusResponse) {
      statusMapping[status.code] = status.label;
    }

    const SalesResponse = response.map((sale) => {
      const codeStatus = sale.code_status;
      const status_name =
        statusMapping[codeStatus] || "Status tidak terdefinisi";
      return { ...sale, status_name };
    });

    res.status(200).json(SalesResponse);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getSalesbyId = async (req, res) => {
  try {
    const response = await prisma.sales.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        sales_item: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
            customer: true,
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

export const postSales = async (req, res) => {
  const Sales = req.body;
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
        data: { ...Sales, no_invoice: newCode },
      });

      return createdSales;
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateSales = async (req, res) => {
  try {
    const response = await prisma.sales.update({
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

export const deleteSales = async (req, res) => {
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
