export class EscenaEscaperoom {

    Archivo: string;
    id: number;
    juegoDeEscaperoomId: number;
    Tilesheet: string;
    Nombre: string;
    profesorId: number;
    escenarioEscaperoomId: number

    constructor(escenarioEscaperoomId?: number, profesorId?: number, juegoDeEscaperoomId?: number, Archivo?: string, Tilesheet?: string, id?: number, Nombre?: string) {
      this.Archivo = Archivo;
      
      this.escenarioEscaperoomId= escenarioEscaperoomId;
      this.id = id;
      this.Tilesheet=Tilesheet;
      this.Nombre= Nombre;
      this.juegoDeEscaperoomId = juegoDeEscaperoomId; 
      this.profesorId = profesorId;
    }
  }