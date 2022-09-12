import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearSkinsComponent } from './crear-skins.component';

describe('CrearSkinsComponent', () => {
  let component: CrearSkinsComponent;
  let fixture: ComponentFixture<CrearSkinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearSkinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearSkinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
