export class EnigmaActivo {

    Resuelto: boolean;
    id: number;
    EnigmaId: number;
    AlumnoJuegoDeEscaperoomId: number;
    EquipoJuegoDeEscaperoomId: number
  
    constructor(EnigmaId?: number, AlumnoJuegoDeEscaperoomId?: number, EquipoJuegoDeEscaperoomId?: number, id?: number) {
  
      this.id = id;
      this.EnigmaId = EnigmaId;
      this.AlumnoJuegoDeEscaperoomId = AlumnoJuegoDeEscaperoomId;
      this.EquipoJuegoDeEscaperoomId = EquipoJuegoDeEscaperoomId;
      this.Resuelto = false;
    }
  }