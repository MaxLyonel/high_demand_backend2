
export interface Condition {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in';
  value: string | number | string[];
}

export class Permission {
  constructor(
    public action: string,
    public subject: string,
    public conditions?: Condition[]
  ) {}
}