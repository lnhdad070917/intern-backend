import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const createUserByUsernameAndPassword = async (admin) => {
  const hashedPassword = bcrypt.hashSync(admin.password, 12);
  return prisma.admin.create({
    data: {
      ...admin,
      password: hashedPassword,
    },
  });
};

const createAccessToken = (user) => {
  return jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "5m",
  });
};

export const postRegisterAdmin = async (req, res, next) => {
  try {
    const { password, name, username } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "You must provide an username and a password." });
    }

    const existingAdmin = await findAdminByUsername(username);

    if (existingAdmin) {
      return res.status(400).json({ error: "Username already in use." });
    }

    const admin = await createUserByUsernameAndPassword({
      password,
      name,
      username,
    });

    return res.json({
      data: admin,
      msg: "success",
    });
  } catch (err) {
    next(err);
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400);
      throw new Error("You must provide an usernmae and a password.");
    }

    const existingAdmin = await findAdminByUsername(username);

    if (!existingAdmin) {
      res.status(403);
      throw new Error("Invalid login credentials.");
    }

    const validPassword = await bcrypt.compare(
      password,
      existingAdmin.password
    );
    if (!validPassword) {
      res.status(403);
      throw new Error("Invalid login credentials.");
    }
    const accessToken = createAccessToken(existingAdmin);

    res.json({
      accessToken,
      msg: "success login",
    });
  } catch (err) {
    next(err);
  }
};

export const profileAdmin = async (req, res, next) => {
  try {
    const { userId } = req.payload;
    const user = await findAdminById(userId);
    delete user.password;
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const findAdminByUsername = async (username) => {
  return prisma.admin.findFirst({
    where: {
      username: username,
    },
  });
};

export const findAdminById = (id) => {
  return prisma.customer.findUnique({
    where: {
      id,
    },
  });
};
