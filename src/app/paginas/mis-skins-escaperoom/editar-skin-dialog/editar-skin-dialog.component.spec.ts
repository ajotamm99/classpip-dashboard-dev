import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarSkinDialogComponent } from './editar-skin-dialog.component';

describe('EditarSkinDialogComponent', () => {
  let component: EditarSkinDialogComponent;
  let fixture: ComponentFixture<EditarSkinDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarSkinDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarSkinDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
