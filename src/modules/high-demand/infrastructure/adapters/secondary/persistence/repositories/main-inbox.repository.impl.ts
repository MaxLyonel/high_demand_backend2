import { MainInboxRepository } from "@high-demand/domain/ports/outbound/main-inbox.repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HighDemandRegistrationEntity } from "../entities/high-demand.entity";
import { In, Repository } from "typeorm";
import { HighDemandRegistration } from "@high-demand/domain/models/high-demand-registration.model";
import { RegistrationStatus } from "@high-demand/domain/enums/registration-status.enum";
import { PlaceTypeEntity } from "../entities/place-type.entity";
import { WorkflowStateEntity } from "../entities/workflow-state.entity";


@Injectable()
export class MainInboxRepositoryImpl implements MainInboxRepository {
  constructor(
    @InjectRepository(HighDemandRegistrationEntity, 'alta_demanda')
    private readonly highDemandRepository: Repository<HighDemandRegistrationEntity>,
    @InjectRepository(PlaceTypeEntity, 'alta_demanda')
    private readonly placeTypeRepository: Repository<PlaceTypeEntity>,
    @InjectRepository(WorkflowStateEntity, 'alta_demanda')
    private readonly workflowStateRepository: Repository<WorkflowStateEntity>
  ) {}

  // ** recibir las altas demandas **
  async receiveHighDemands(
    highDemandIds: number[]
  ): Promise<HighDemandRegistration[]> {
    const workflowState = await this.workflowStateRepository.findOne({
      where: { name: 'EN REVISION' },
      select: { id: true }
    })
    if(!workflowState?.id) throw new Error(
      "No existe estado de flujos para recepcionar, porfavor contactese con el administrador"
    )
    const result = await this.highDemandRepository.update(
      { id: In(highDemandIds) },
      { inbox: true, workflowStateId: workflowState.id },
    );
    if (result.affected && result.affected <= 0) {
      throw new Error('No se recepcionaron las altas demandas');
    }
    const highDemandEntities = await this.highDemandRepository.find({
      where: {
        id: In(highDemandIds),
      },
    });
    if (!highDemandEntities.length) throw new Error('No existe las Altas Demandas');
    return highDemandEntities.map(HighDemandRegistrationEntity.toDomain)
  }

  // ** derivar las altas demandas **
  async deriveHighDemands(
    highDemandIds: number[],
    rolId: number
  ): Promise<HighDemandRegistration[]> {
    const workflowState = await this.workflowStateRepository.findOne({
      where: { name: 'ENVIADO' },
      select: { id: true }
    })
    if(!workflowState?.id) throw new Error(
      "No existe estado de flujos para derivar, porfavor contáctese con el administrador"
    )
    const result = await this.highDemandRepository.update(
      { id: In(highDemandIds) },
      { inbox: false, workflowStateId: workflowState.id, rolId: rolId }
    )
    if(result.affected && result.affected <= 0) {
      throw new Error('No se realizó la derivación')
    }
    const highDemandEntities = await this.highDemandRepository.find({
      where: {
        id: In(highDemandIds)
      }
    })
    if(!highDemandEntities.length) throw new Error('No existe las Altas demandas')
    return highDemandEntities.map(HighDemandRegistrationEntity.toDomain)
  }

  // ** devolver una alta demanda **
  async returnHighDemands(highDemandId: number, rolId: number): Promise<HighDemandRegistration> {
    const workflowState = await this.workflowStateRepository.findOne({
      where: { name: 'DEVUELTO'},
      select: { id: true }
    })
    if(!workflowState?.id) throw new Error(
      "No existe estado de flujos para devolver, por favor contáctese con el administrador"
    )

    const updateData: Partial<HighDemandRegistrationEntity> = {
      inbox: false,
      workflowStateId: workflowState.id
    }

    if(rolId === 9) {
      Object.assign(updateData, {
        registrationStatus: RegistrationStatus.REJECTED
      })
    } else {
      Object.assign(updateData, {
        rolId
      })
    }
    const { affected } = await this.highDemandRepository.update(
      { id: highDemandId },
      updateData
    )
    if(!affected || affected <= 0) {
      throw new Error('No se realizó la devolución')
    }

    const highDemandEntity = await this.highDemandRepository.findOne({
      where: { id: highDemandId }
    });

    if (!highDemandEntity) {
      throw new Error('No existe la Alta demanda');
    }

    return HighDemandRegistrationEntity.toDomain(highDemandEntity);
  }

  // ** aprobar la alta demanda **
  async approveHighDemand(
    id: number,
    registrationStatus: RegistrationStatus
  ): Promise<HighDemandRegistration> {
    const result = await this.highDemandRepository.update(
      { id: id },
      { registrationStatus: registrationStatus }
    )
    if(result.affected && result.affected <= 0) {
      throw new Error("No se aprobo la alta demanda")
    }
    const highDemandEntity = await this.highDemandRepository.findOne({
      where: {
        id: id,
      }
    })
    if(!highDemandEntity) throw new Error('No existe la Alta demanda');
    return HighDemandRegistrationEntity.toDomain(highDemandEntity)
  }

  // ** rechazar la alta demanda
  async declinehighDemand(
    highDemandId: number,
  ): Promise<HighDemandRegistration> {

    const workflowState = await this.workflowStateRepository.findOne({
      where: { name: 'ENVIADO'},
      select: { id: true }
    })
    if(!workflowState?.id) throw new Error(
      "No existe estado de flujos para rechazar, por favor contáctese con el administrdor"
    )

    const result = await this.highDemandRepository.update(
      { id: highDemandId },
      {
        inbox: false,
        workflowStateId: workflowState.id,
        registrationStatus: RegistrationStatus.REJECTED,
      }
    )
    if(result.affected && result.affected <= 0) {
      throw new Error("No se rechazo la alta demanda")
    }
    const highDemandEntity = await this.highDemandRepository.findOne({
      where: {
        id: highDemandId
      }
    })
    if(!highDemandEntity) throw new Error('No existe la Alta demanda');
    return HighDemandRegistrationEntity.toDomain(highDemandEntity)
  }

  // ** busca altas demandas por distrito que esten en la bandeja de entrada **
  async searchInbox(
    rolId: number,
    placeTypes: number[]
  ): Promise<HighDemandRegistration[]> {
    const workflowStates = await this.workflowStateRepository.find({
      where: { name: In(['DEVUELTO', 'ENVIADO'])},
      select: { id: true }
    })
    if(!workflowStates.length) throw new Error(
      "No existe estado de flujos para devolver, por favor contáctese con el administrador"
    )
    const highDemands = await this.highDemandRepository.find({
      where: {
        workflowStateId: In(workflowStates.map(w => w.id)),
        rolId: rolId,
        inbox: false,
        placeDistrict: In(placeTypes)
      },
      relations: ['courses', 'courses.level', 'courses.grade', 'courses.parallel'],
      order: {
        id: 'DESC'
      }
    });
    return highDemands.map(HighDemandRegistrationEntity.toDomain);
  }

  // ** busca altas demandas por distrito que esten recepcionadas **
  async searchReceived(
    rolId: number,
    placeTypes: number[]
  ): Promise<HighDemandRegistration[]> {
    const highDemands = await this.highDemandRepository.find({
      where: {
        workflowStateId: 2,
        rolId: rolId,
        inbox: true,
        placeDistrict: In(placeTypes)
      },
      relations: ['courses', 'courses.level', 'courses.grade', 'courses.parallel'],
      order: {
        id: 'DESC'
      }
    });
    return highDemands.map(HighDemandRegistrationEntity.toDomain);
  }

  async searchChildren(parentId: number): Promise<PlaceTypeEntity[]> {
    const result = await this.placeTypeRepository.find({
      where: { parentId: parentId },
    });
    return result
  }
}