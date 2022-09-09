import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearMapaComponent } from './crear-mapa.component';

describe('CrearMapaComponent', () => {
  let component: CrearMapaComponent;
  let fixture: ComponentFixture<CrearMapaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearMapaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearMapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
