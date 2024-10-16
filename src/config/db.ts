import mongoose from "mongoose";
import { exit } from "node:process";
import colors from "colors";

export const connectDB = async () => {
  
  try {
     const {connection} = await mongoose.connect(process.env.DATABASE_URL, {
      connectTimeoutMS: 1000
     });
     const url = `${connection.host}:${connection.port}`
     console.log(colors.magenta.bold(`MongoDB Conectado en: ${url}`))
  } catch (error) {
    console.error('Error al conectar a la base de datos', error);
    exit(1); // Salir con error
  }
};

