import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarEscenasPublicasComponent } from './mostrar-escenas-publicas.component';

describe('MostrarEscenasPublicasComponent', () => {
  let component: MostrarEscenasPublicasComponent;
  let fixture: ComponentFixture<MostrarEscenasPublicasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MostrarEscenasPublicasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostrarEscenasPublicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
