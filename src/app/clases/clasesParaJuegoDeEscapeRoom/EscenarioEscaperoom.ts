export class EscenarioEscaperoom {

    id: number;
    profesorId: number;
    Nombre: string;
    Descripcion: string;
  
    constructor(profesorId?: number, Nombre?: string, Descripcion?: string, id?: number) {
  
      this.Descripcion = Descripcion;
      this.id = id;
      this.profesorId = profesorId;
      this.Nombre = Nombre;
  
    }
  }