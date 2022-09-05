export class EquipoJuegoDeEscaperoom {

    PuntosTotalesEquipo: number;
    id: number;
    equipoId: number;
    juegoDeEscaperoomId: number;
    TiempoEnResolver: number;
    Resuelto: boolean;
  
    constructor(equipoId?: number, juegoDeEscaperoomId?: number, PuntosTotalesEquipo?: number, id?: number) {
  
      this.PuntosTotalesEquipo = PuntosTotalesEquipo;
      this.id = id;
      this.equipoId = equipoId;
      this.juegoDeEscaperoomId = juegoDeEscaperoomId;
      this.TiempoEnResolver = 0;
      this.Resuelto = false;
    }
  }