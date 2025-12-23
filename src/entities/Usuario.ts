import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import type { Registro } from './Registro';

@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text' })
    nombres!: string;

    @Column({ type: 'text' })
    primer_apellido!: string;

    @Column({ type: 'text' })
    segundo_apellido!: string;

    @Column({ type: 'text', unique: true })
    dni!: string;

    @OneToMany('Registro', 'usuario')
    registros?: Registro[];
}
