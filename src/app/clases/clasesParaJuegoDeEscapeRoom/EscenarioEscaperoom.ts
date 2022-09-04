export class EscenarioEscaperoom {

    id: number;
    ProfesorId: number;
    Nombre: string;
    Descripcion: string;
  
    constructor(ProfesorId?: number, Nombre?: string, Descripcion?: string, id?: number) {
  
      this.Descripcion = Descripcion;
      this.id = id;
      this.ProfesorId = ProfesorId;
      this.Nombre = Nombre;
  
    }
  }