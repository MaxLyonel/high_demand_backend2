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
    public action: Action,
    public subject: Resource,
    public conditions?: Condition[]
  ) {}

  static create({
    action,
    subject,
    conditions
  }: {
    action: Action,
    subject: Resource,
    conditions: Condition[]
  }): Permission {
    return new Permission(action, subject, conditions)
  }
}