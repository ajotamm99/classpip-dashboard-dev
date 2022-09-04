export class ObjetoEscaperoom {

    Nombre: string;
    Imagen: string;
    Tipo: String;
    id: number;
    ProfesorId: number;
  
    constructor(ProfesorId?: number, Nombre?: string, Imagen?: string, id?: number, Tipo?: string) {
  
      this.Nombre = Nombre;
      this.id = id;
      this.ProfesorId = ProfesorId;
      this.Imagen = Imagen;
      this.Tipo = Tipo;
    }
  }