import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEnigmasComponent } from './crear-enigmas.component';

describe('CrearEnigmasComponent', () => {
  let component: CrearEnigmasComponent;
  let fixture: ComponentFixture<CrearEnigmasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearEnigmasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearEnigmasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
