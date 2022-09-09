export class Enigma {

    Nombre: string;
    id: number;
    profesorId: number;
    Tipo: string;
    Dificultad: string;
    Publica: boolean;
  
    constructor(profesorId?: number, Tipo?: string, Nombre?: string, Dificultad?:string) {
  
      this.Nombre = Nombre;
      this.profesorId = profesorId;
      this.Tipo = Tipo;
      this.Dificultad = Dificultad; 
      this.Publica =false;
    }
  }