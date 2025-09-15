import { OperatorEnum } from "../enums/operator.enum";

export class Resource {
  id: number;
  name: string;
}

export class Action {
  id: number;
  name: string;
}

export class Condition {
  field: string;
  operator: OperatorEnum;
  value: string | number | string[];
}

export class Permission {
  constructor(
    public id: number,
    public description: string,
    public active: boolean,
    public action?: Action,
    public subject?: Resource,
    public conditions?: Condition[]
  ) {}

  static create({
    id,
    description,
    active,
    action,
    subject,
    conditions
  }: {
    id: number,
    description: string,
    active: boolean,
    action?: Action,
    subject?: Resource,
    conditions?: Condition[]
  }): Permission {
    return new Permission(id, description, active, action, subject, conditions)
  }
}