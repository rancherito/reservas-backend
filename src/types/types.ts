export interface Habitacion {
  id: number;
  tipo_habitacion: string;
  piso: number;
}

export interface Usuario {
  id: number;
  nombres: string;
  primer_apellido: string;
  segundo_apellido: string;
  dni: string;
}

export interface Registro {
  id: number;
  habitacion_id: number;
  usuario_id: number | null;
  estado: 0 | 1 | 2; // 0 = libre, 1 = reservado, 2 = ocupado
  fecha_registro: string;
}

export interface RegistroConRelaciones extends Registro {
  habitacion?: Habitacion;
  usuario?: Usuario;
}
