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
    public description: string,
    public active: boolean,
    public action: Action,
    public subject: Resource,
    public conditions?: Condition[]
  ) {}

  static create({
    description,
    active,
    action,
    subject,
    conditions
  }: {
    description: string,
    active: boolean,
    action: Action,
    subject: Resource,
    conditions?: Condition[]
  }): Permission {
    return new Permission(description, active, action, subject, conditions)
  }
}