export class EscenaActiva {

    id: number;
    EscenarioId: number;
    EscenaId: number;
    JuegoDeEscaperoomId: number;
  
    constructor(EscenarioId?: number, EscenaId?: number, id?: number, JuegoDeEscaperoomId?: number) {
  
      this.id = id;
      this.EscenarioId = EscenarioId;  
      this.EscenaId = EscenaId;
      this.JuegoDeEscaperoomId= JuegoDeEscaperoomId;
    }
  }