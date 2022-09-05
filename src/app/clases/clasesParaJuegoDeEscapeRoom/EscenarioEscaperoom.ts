export class EscenarioEscaperoom {

    id: number;
    profesorId: number;
    Nombre: string;
    Descripcion: string;    
    Publica: boolean;
  
    constructor(profesorId?: number, Nombre?: string, Descripcion?: string, id?: number) {
  
      this.Descripcion = Descripcion;
      this.id = id;
      this.profesorId = profesorId;
      this.Nombre = Nombre;
      this.Publica = false;
  
    }
  }