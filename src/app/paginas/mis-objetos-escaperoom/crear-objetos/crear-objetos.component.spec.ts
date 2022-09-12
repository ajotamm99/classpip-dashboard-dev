import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearObjetosComponent } from './crear-objetos.component';

describe('CrearObjetosComponent', () => {
  let component: CrearObjetosComponent;
  let fixture: ComponentFixture<CrearObjetosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearObjetosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearObjetosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
