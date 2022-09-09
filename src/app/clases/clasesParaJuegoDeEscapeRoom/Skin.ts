export class Skin {

    Nombre: string;
    id: number;
    profesorId: number;
    Spritesheet: string;    
    Publica: boolean;
  
    constructor(profesorId?: number, Spritesheet?: string, Nombre?: string) {
  
      this.Nombre = Nombre;
      this.profesorId = profesorId;
      this.Spritesheet = Spritesheet;
      this.Publica=false;
    }
  }