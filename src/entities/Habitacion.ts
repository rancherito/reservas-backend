import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import type { Registro } from './Registro';

@Entity('habitaciones')
export class Habitacion {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text' })
    tipo_habitacion!: string;

    @Column({ type: 'integer' })
    piso!: number;

    @OneToOne('Registro', 'habitacion')
    registro?: Registro;
}
