import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity({ schema: 'alta_demanda', name: 'acciones'})
export class ActionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre'})
  name: string;

  @Column({ name: 'creado_en', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}