export class EscenaEscaperoom {

    Archivo: string;
    id: number;
    EscenarioId: number;
    Tilesheet: string;
    Nombre: string;
  
    constructor(EscenarioId?: number, Archivo?: string, Tilesheet?: string, id?: number, Nombre?: string) {
  
      this.Archivo = Archivo;
      this.id = id;
      this.Tilesheet=Tilesheet;
      this.Nombre= Nombre;
      this.EscenarioId = EscenarioId;  
    }
  }