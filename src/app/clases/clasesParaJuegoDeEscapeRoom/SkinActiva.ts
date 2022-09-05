export class SkinActiva {

    id: number;
    skinId: number;
    alumnoId: number;
  
    constructor(alumnoId?: number, skinId?: number, id?: number) {
  
      this.id = id;
      this.alumnoId = alumnoId;
      this.skinId = skinId;
  
    }
  }