export class ObjetoEscaperoom {

    Nombre: string;
    Imagen: string;
    Tipo: String;
    id: number;
    profesorId: number;    
    Publica: boolean;
  
    constructor( Nombre?: string, Imagen?: string, Tipo?: string, profesorId?: number,) {
  
      this.Nombre = Nombre;
      this.profesorId = profesorId;
      this.Imagen = Imagen;
      this.Tipo = Tipo;
      this.Publica=false;
    }
  }