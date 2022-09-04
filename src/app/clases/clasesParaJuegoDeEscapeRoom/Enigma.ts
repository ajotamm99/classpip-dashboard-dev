export class Enigma {

    Nombre: string;
    id: number;
    ProfesorId: number;
    Tipo: string;
    Dificultad: string;
  
    constructor(ProfesorId?: number, Tipo?: string, Nombre?: string, id?: number, Dificultad?:string) {
  
      this.Nombre = Nombre;
      this.id = id;
      this.ProfesorId = ProfesorId;
      this.Tipo = Tipo;
      this.Dificultad = Dificultad; 
  
    }
  }