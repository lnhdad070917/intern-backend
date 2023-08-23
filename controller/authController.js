import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const createUserByEmailAndPassword = async (user) => {
  const hashedPassword = bcrypt.hashSync(user.password, 12);
  return prisma.customer.create({
    data: {
      ...user,
      password: hashedPassword,
    },
  });
};

export const postRegister = async (req, res, next) => {
  try {
    const {
      email,
      password,
      name,
      address,
      no_wa,
      city,
      province,
      postal_code,
      username,
    } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "You must provide an email and a password." });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }

    const user = await createUserByEmailAndPassword({
      email,
      password,
      name,
      address,
      no_wa,
      city,
      province,
      postal_code,
      username,
    });

    return res.json({
      data: user,
      msg: "success",
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("You must provide an email and a password.");
    }

    const existingUser = await findUserByEmail(email);

    if (!existingUser) {
      res.status(403);
      throw new Error("Invalid login credentials.");
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      res.status(403);
      throw new Error("Invalid login credentials.");
    }

    const jti = uuidv4();

    res.json({
      msg: "success login",
    });
  } catch (err) {
    next(err);
  }
};

export const profile = async (req, res, next) => {
  try {
    const { userId } = req.payload;
    const user = await findUserById(userId);
    delete user.password;
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const findUserByEmail = async (email) => {
  return prisma.customer.findUnique({
    where: {
      email,
    },
  });
};

export const findUserById = (id) => {
  return prisma.customer.findUnique({
    where: {
      id,
    },
  });
};
