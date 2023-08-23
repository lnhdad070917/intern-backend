import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";

export const getCustomer = async (req, res) => {
  try {
    const response = await prisma.customer.findMany();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getCustomerbyId = async (req, res) => {
  try {
    const response = await prisma.customer.findUnique({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const postCustomer = async (req, res) => {
  const customerData = req.body;
  try {
    const existingCustomer = await prisma.customer.findUnique({
      where: {
        email: customerData.email,
      },
    });

    if (existingCustomer) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const hashedPassword = bcrypt.hashSync(customerData.password, 12);
    const createdCustomer = await prisma.customer.create({
      data: { ...customerData, password: hashedPassword },
    });

    res.status(200).json(createdCustomer);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  const customerData = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(customerData.password, 12);
    const customer = await prisma.customer.update({
      where: {
        id: Number(req.params.id),
      },
      data: { ...customerData, password: hashedPassword },
    });
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const customer = await prisma.customer.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
