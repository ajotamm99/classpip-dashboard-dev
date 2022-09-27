export class ObjetoActivo {

    id: number;
    objetoEscaperoomId: number;
    alumnoJuegoDeEscaperoomId: number;
    equipoJuegoDeEscaperoomId: number;
    escenaActivaId: number
    Usado: boolean;
    EnMochila: boolean;
    MochilaBool: boolean;
    PistaBool: boolean;
    PistaString: string;
    MovilBool: boolean;
    PreguntaBool: boolean;
    Lugar: string;

    constructor(objetoEscaperoomId?: number, alumnoJuegoDeEscaperoomId?: number, equipoJuegoDeEscaperoomId?: number) {
  
      this.objetoEscaperoomId = objetoEscaperoomId;
      this.alumnoJuegoDeEscaperoomId = alumnoJuegoDeEscaperoomId;
      this.equipoJuegoDeEscaperoomId = equipoJuegoDeEscaperoomId;
      this.Usado =false;
      this.EnMochila =false;
    }
  }