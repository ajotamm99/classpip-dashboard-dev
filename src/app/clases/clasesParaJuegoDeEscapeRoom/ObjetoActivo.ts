export class ObjetoActivo {

    id: number;
    objetoEscaperoomId: number;
    alumnoJuegoDeEscaperoomId: number;
    equipoJuegoDeEscaperoomId: number;
    Usado: boolean;
    EnMochila: boolean;
    

  
    constructor(objetoEscaperoomId?: number, alumnoJuegoDeEscaperoomId?: number, equipoJuegoDeEscaperoomId?: number, id?: number) {
  
      this.id = id;
      this.objetoEscaperoomId = objetoEscaperoomId;
      this.alumnoJuegoDeEscaperoomId = alumnoJuegoDeEscaperoomId;
      this.equipoJuegoDeEscaperoomId = equipoJuegoDeEscaperoomId;
      this.Usado =false;
      this.EnMochila =false;
    }
  }