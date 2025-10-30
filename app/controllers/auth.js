import bcrypt from "bcryptjs";
import { db } from "../drizzle/client.js";
import { users } from "../drizzle/schema.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Verificar si el usuario ya existe
        const existingUser = await db.select().from(users).where(users.email.eq(email));
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }
        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        // Crear el nuevo usuario   
        const newUser = await db.insert(users).values({
            username,
            email,
            password: hashedPassword,
        }).returning();
        res.status(201).json({ message: "Usuario registrado exitosamente", user: newUser[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Verificar si el usuario existe
        const user = await db.select().from(users).where(users.email.eq(email)).limit(1);
        if (user.length === 0) {
            return res.status(400).json({ message: "Credenciales inválidas" });
        }
        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: "Credenciales inválidas" });
        }
        // Generar token
        const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Inicio de sesión exitoso", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};
