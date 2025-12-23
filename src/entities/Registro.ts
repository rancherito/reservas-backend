import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import type { Habitacion } from './Habitacion';
import type { Usuario } from './Usuario';

@Entity('registros')
export class Registro {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'integer', unique: true })
    habitacion_id!: number;

    @Column({ type: 'integer', nullable: true })
    usuario_id!: number | null;

    @Column({ type: 'integer', default: 0 })
    estado!: number; // 0 = libre, 1 = reservado, 2 = ocupado

    @Column({ type: 'text' })
    fecha_registro!: string;

    @OneToOne('Habitacion', 'registro', {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'habitacion_id' })
    habitacion?: Habitacion;

    @ManyToOne('Usuario', 'registros', {
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'usuario_id' })
    usuario?: Usuario | null;
}
