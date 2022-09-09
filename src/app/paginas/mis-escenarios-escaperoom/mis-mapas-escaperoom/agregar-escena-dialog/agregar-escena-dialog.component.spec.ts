import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarEscenaDialogComponent } from './agregar-escena-dialog.component';

describe('AgregarEscenaDialogComponent', () => {
  let component: AgregarEscenaDialogComponent;
  let fixture: ComponentFixture<AgregarEscenaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarEscenaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarEscenaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
