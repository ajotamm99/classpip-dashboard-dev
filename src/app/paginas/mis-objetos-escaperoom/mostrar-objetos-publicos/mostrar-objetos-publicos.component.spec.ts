import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarObjetosPublicosComponent } from './mostrar-objetos-publicos.component';

describe('MostrarObjetosPublicosComponent', () => {
  let component: MostrarObjetosPublicosComponent;
  let fixture: ComponentFixture<MostrarObjetosPublicosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MostrarObjetosPublicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostrarObjetosPublicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
