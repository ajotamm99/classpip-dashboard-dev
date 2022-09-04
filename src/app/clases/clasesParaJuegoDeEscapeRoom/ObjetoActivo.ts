export class ObjetoActivo {

    Resuelto: boolean;
    id: number;
    EnigmaId: number;
    AlumnoJuegoDeEscaperoomId: number;
    EquipoJuegoDeEscaperoomId: number;
    Usado: boolean;
    EnMochila: boolean;
    

  
    constructor(EnigmaId?: number, AlumnoJuegoDeEscaperoomId?: number, EquipoJuegoDeEscaperoomId?: number, id?: number) {
  
      this.id = id;
      this.EnigmaId = EnigmaId;
      this.AlumnoJuegoDeEscaperoomId = AlumnoJuegoDeEscaperoomId;
      this.EquipoJuegoDeEscaperoomId = EquipoJuegoDeEscaperoomId;
      this.Resuelto = false;
      this.Usado =false;
      this.EnMochila =false;
    }
  }