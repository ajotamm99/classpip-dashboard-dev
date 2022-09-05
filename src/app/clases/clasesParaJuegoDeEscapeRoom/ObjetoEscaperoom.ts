export class ObjetoEscaperoom {

    Nombre: string;
    Imagen: string;
    Tipo: String;
    id: number;
    profesorId: number;    
    Publica: boolean;
  
    constructor(profesorId?: number, Nombre?: string, Imagen?: string, id?: number, Tipo?: string) {
  
      this.Nombre = Nombre;
      this.id = id;
      this.profesorId = profesorId;
      this.Imagen = Imagen;
      this.Tipo = Tipo;
      this.Publica=false;
    }
  }