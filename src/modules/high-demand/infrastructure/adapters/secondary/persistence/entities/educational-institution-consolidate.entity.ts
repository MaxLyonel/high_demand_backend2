import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { EducationalInstitutionEntity } from "./educational-institution.entity";
import { OperativeEntity } from "src/modules/operations-programming/infrastructure/adapters/secondary/persistence/entities/operations-programming.entity";


@Entity({ schema: 'alta_demanda', name: 'institucion_educativa_consolidacion'})
export class EducationalInstitutionConsolidateEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'consolidado', default: false })
  consolidate: boolean;

  @Column({ name: 'fecha_consolidacion', type: 'timestamp', nullable: true})
  consolidateDate: Date | null;

  @ManyToOne(() => EducationalInstitutionEntity, { eager: false })
  @JoinColumn({ name: 'institucioneducativa_id' })
  educationalInstitution: EducationalInstitutionEntity;

  @ManyToOne(() => OperativeEntity, { eager: false })
  @JoinColumn({ name: 'operativo_id' })
  operative: OperativeEntity;

}