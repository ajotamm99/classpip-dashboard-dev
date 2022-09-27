export class PreguntaActiva {
    preguntaId: number;
    objetoActivoId: number;
    id: number;

  constructor(preguntaId?: number, objetoActivoId?: number) {

    this.preguntaId = preguntaId;
    this.objetoActivoId = objetoActivoId;
  }
}
