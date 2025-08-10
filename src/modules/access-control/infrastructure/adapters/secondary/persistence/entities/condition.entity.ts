import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PermissionEntity } from "./permission.entity";

export enum OperatorEnum {
  EQ = '=',
  NEQ = '!=',
  GT = '>',
  LT = '<',
  GTE = '>=',
  LTE = '<=',
  IN = 'in',
}

@Entity({ schema: 'alta_demanda', name: 'condiciones' })
export class ConditionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'campo'})
  field: string;

  @Column({ name: 'valor'})
  value: string;

  @Column({ name: 'operador', type: 'enum', enum: OperatorEnum })
  operator: OperatorEnum;

  @ManyToOne(() => PermissionEntity, (permiso) => permiso.condition)
  @JoinColumn({ name: 'permiso_id' })
  permission: PermissionEntity;
}