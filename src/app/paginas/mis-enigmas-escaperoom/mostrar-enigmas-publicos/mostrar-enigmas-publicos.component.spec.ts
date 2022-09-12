import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarEnigmasPublicosComponent } from './mostrar-enigmas-publicos.component';

describe('MostrarEnigmasPublicosComponent', () => {
  let component: MostrarEnigmasPublicosComponent;
  let fixture: ComponentFixture<MostrarEnigmasPublicosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MostrarEnigmasPublicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MostrarEnigmasPublicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
