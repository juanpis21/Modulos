import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Calificacion } from './calificacion';

describe('Calificacion', () => {
  let component: Calificacion;
  let fixture: ComponentFixture<Calificacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Calificacion],
    }).compileComponents();

    fixture = TestBed.createComponent(Calificacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
