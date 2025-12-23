import { Database } from "bun:sqlite";

export const db = new Database("reservas.db");

// Crear tablas si no existen
export const initDatabase = () => {
  // Crear tabla de habitaciones
  db.run(`
    CREATE TABLE IF NOT EXISTS habitaciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo_habitacion TEXT NOT NULL,
      piso INTEGER NOT NULL
    )
  `);

  // Crear tabla de usuarios
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombres TEXT NOT NULL,
      primer_apellido TEXT NOT NULL,
      segundo_apellido TEXT NOT NULL,
      dni TEXT NOT NULL UNIQUE
    )
  `);

  console.log("✅ Base de datos inicializada");
};
