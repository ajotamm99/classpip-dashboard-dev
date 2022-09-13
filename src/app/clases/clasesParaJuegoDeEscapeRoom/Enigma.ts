export class Enigma {

    Nombre: string;
    id: number;
    profesorId: number;
    Tipo: string;
    Dificultad: string;
    Publica: boolean;
  
    constructor( Tipo?: string, Nombre?: string, Dificultad?:string, profesorId?: number) {
  
      this.Nombre = Nombre;
      this.profesorId = profesorId;
      this.Tipo = Tipo;
      this.Dificultad = Dificultad; 
      this.Publica =false;
    }
  }