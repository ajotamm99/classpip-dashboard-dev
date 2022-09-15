export class EscenaEscaperoom {

    Archivo: string;
    id: number;
    Tilesheet: string;
    Nombre: string;
    escenarioEscapeRoomId: number    
    Publica: boolean;

    constructor( Archivo?: string, Tilesheet?: string, Nombre?: string, escenarioEscapeRoomId?: number,) {
      this.Archivo = Archivo;      
      this.escenarioEscapeRoomId= escenarioEscapeRoomId;
      this.Tilesheet=Tilesheet;
      this.Nombre= Nombre;
      this.Publica=false;
    }
  }