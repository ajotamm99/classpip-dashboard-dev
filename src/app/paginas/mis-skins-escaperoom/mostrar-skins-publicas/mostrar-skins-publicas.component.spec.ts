import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarSkinsPublicasComponent } from './mostrar-skins-publicas.component';

describe('MostrarSkinsPublicasComponent', () => {
  let component: MostrarSkinsPublicasComponent;
  let fixture: ComponentFixture<MostrarSkinsPublicasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MostrarSkinsPublicasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostrarSkinsPublicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
