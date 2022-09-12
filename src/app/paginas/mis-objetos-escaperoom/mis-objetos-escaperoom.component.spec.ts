import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisObjetosEscaperoomComponent } from './mis-objetos-escaperoom.component';

describe('MisObjetosEscaperoomComponent', () => {
  let component: MisObjetosEscaperoomComponent;
  let fixture: ComponentFixture<MisObjetosEscaperoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisObjetosEscaperoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisObjetosEscaperoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
