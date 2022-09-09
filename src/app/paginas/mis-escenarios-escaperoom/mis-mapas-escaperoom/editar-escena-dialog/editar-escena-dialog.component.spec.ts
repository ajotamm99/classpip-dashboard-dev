import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarEscenaDialogComponent } from './editar-escena-dialog.component';

describe('EditarEscenaDialogComponent', () => {
  let component: EditarEscenaDialogComponent;
  let fixture: ComponentFixture<EditarEscenaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarEscenaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarEscenaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
