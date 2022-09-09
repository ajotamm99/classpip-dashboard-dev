export class EnigmaActivo {

    Resuelto: boolean;
    id: number;
    EnigmaId: number;
    alumnoJuegoDeEscaperoomId: number;
    equipoJuegoDeEscaperoomId: number
  
    constructor(EnigmaId?: number, alumnoJuegoDeEscaperoomId?: number, equipoJuegoDeEscaperoomId?: number) {
  
      this.EnigmaId = EnigmaId;
      this.alumnoJuegoDeEscaperoomId = alumnoJuegoDeEscaperoomId;
      this.equipoJuegoDeEscaperoomId = equipoJuegoDeEscaperoomId;
      this.Resuelto = false;
    }
  }