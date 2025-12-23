import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table, TableForeignKey } from 'typeorm';

export class InitialMigration1703350000000 implements MigrationInterface {
    name = 'InitialMigration1703350000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crear tabla de habitaciones
        await queryRunner.createTable(
            new Table({
                name: 'habitaciones',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'tipo_habitacion',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'piso',
                        type: 'integer',
                        isNullable: false,
                    },
                ],
            }),
            true
        );

        // Crear tabla de usuarios
        await queryRunner.createTable(
            new Table({
                name: 'usuarios',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'nombres',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'primer_apellido',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'segundo_apellido',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'dni',
                        type: 'text',
                        isNullable: false,
                        isUnique: true,
                    },
                ],
            }),
            true
        );

        // Crear tabla de registros
        await queryRunner.createTable(
            new Table({
                name: 'registros',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'habitacion_id',
                        type: 'integer',
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: 'usuario_id',
                        type: 'integer',
                        isNullable: true,
                    },
                    {
                        name: 'estado',
                        type: 'integer',
                        isNullable: false,
                        default: 0,
                    },
                    {
                        name: 'fecha_registro',
                        type: 'text',
                        isNullable: false,
                    },
                ],
            }),
            true
        );

        // Crear foreign key de registros -> habitaciones
        await queryRunner.createForeignKey(
            'registros',
            new TableForeignKey({
                columnNames: ['habitacion_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'habitaciones',
                onDelete: 'CASCADE',
            })
        );

        // Crear foreign key de registros -> usuarios
        await queryRunner.createForeignKey(
            'registros',
            new TableForeignKey({
                columnNames: ['usuario_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'usuarios',
                onDelete: 'SET NULL',
            })
        );

        console.log('✅ Migración inicial ejecutada: tablas creadas');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar foreign keys primero
        const registrosTable = await queryRunner.getTable('registros');
        if (registrosTable) {
            const foreignKeys = registrosTable.foreignKeys;
            for (const fk of foreignKeys) {
                await queryRunner.dropForeignKey('registros', fk);
            }
        }

        // Eliminar tablas en orden inverso
        await queryRunner.dropTable('registros', true);
        await queryRunner.dropTable('usuarios', true);
        await queryRunner.dropTable('habitaciones', true);

        console.log('✅ Migración revertida: tablas eliminadas');
    }
}
