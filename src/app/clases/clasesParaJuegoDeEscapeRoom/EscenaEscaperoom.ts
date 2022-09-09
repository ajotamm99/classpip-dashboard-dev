export class EscenaEscaperoom {

    Archivo: string;
    id: number;
    Tilesheet: string;
    Nombre: string;
    escenarioEscaperoomId: number    
    Publica: boolean;

    constructor(escenarioEscaperoomId?: number, Archivo?: string, Tilesheet?: string, Nombre?: string) {
      this.Archivo = Archivo;      
      this.escenarioEscaperoomId= escenarioEscaperoomId;
      this.Tilesheet=Tilesheet;
      this.Nombre= Nombre;
      this.Publica=false;
    }
  }