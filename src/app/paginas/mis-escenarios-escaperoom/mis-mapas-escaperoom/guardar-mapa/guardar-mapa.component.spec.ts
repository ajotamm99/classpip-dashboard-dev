import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardarMapaComponent } from './guardar-mapa.component';

describe('GuardarMapaComponent', () => {
  let component: GuardarMapaComponent;
  let fixture: ComponentFixture<GuardarMapaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuardarMapaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardarMapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
