import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { InitialMigration1703350000000 } from '../migrations/1703350000000-InitialMigration';
import { Habitacion } from '../entities/Habitacion';
import { Registro } from '../entities/Registro';
import { Usuario } from '../entities/Usuario';

export const AppDataSource = new DataSource({
    type: 'sqljs',
    database: new Uint8Array(0),
    location: 'reservas.db',
    autoSave: true,
    synchronize: false, // Usamos migraciones en vez de sincronización automática
    logging: false,
    entities: [Habitacion, Usuario, Registro],
    migrations: [InitialMigration1703350000000],
    migrationsRun: true, // Ejecutar migraciones automáticamente al iniciar
});

export const initDatabase = async (): Promise<void> => {
    try {
        await AppDataSource.initialize();
        console.log('✅ Base de datos inicializada con TypeORM');
        console.log('✅ Migraciones ejecutadas automáticamente');
    } catch (error) {
        console.error('❌ Error al inicializar la base de datos:', error);
        throw error;
    }
};

// Exportar repositorios para uso en rutas
export const getHabitacionRepository = () => AppDataSource.getRepository(Habitacion);
export const getUsuarioRepository = () => AppDataSource.getRepository(Usuario);
export const getRegistroRepository = () => AppDataSource.getRepository(Registro);
