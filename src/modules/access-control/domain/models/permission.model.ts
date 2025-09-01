export interface Resource {
  id: number;
  name: string;
}

export interface Action {
  id: number;
  name: string;
}

export interface Condition {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in';
  value: string | number | string[];
}

export class Permission {
  constructor(
    public id: number,
    public description: string,
    public active: boolean,
    public action: Action,
    public subject: Resource,
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
    action: Action,
    subject: Resource,
    conditions?: Condition[]
  }): Permission {
    return new Permission(id, description, active, action, subject, conditions)
  }
}