export class Enigma {

    Nombre: string;
    id: number;
    profesorId: number;
    Tipo: string;
    Dificultad: string;
  
    constructor(profesorId?: number, Tipo?: string, Nombre?: string, id?: number, Dificultad?:string) {
  
      this.Nombre = Nombre;
      this.id = id;
      this.profesorId = profesorId;
      this.Tipo = Tipo;
      this.Dificultad = Dificultad; 
  
    }
  }