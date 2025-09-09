import { Rol } from "./rol.model";



export class UserRole {
  constructor(
    public readonly id: number,
    public readonly active: boolean,
    public readonly role: Rol,
    public readonly placeType?: {
      id: number;
      name: string;
      parent?: {
        id: number;
        name: string;
      }
    }
  ){}

  static create(props: {
    id: number;
    active: boolean;
    role: Rol;
    placeType?: {
      id: number;
      name: string;
      parent?: { id: number; name: string };
    };
  }) {
    return new UserRole(props.id, props.active, props.role, props.placeType)
  }
}