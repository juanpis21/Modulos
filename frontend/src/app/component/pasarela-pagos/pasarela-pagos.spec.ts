import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasarelaPagos } from './pasarela-pagos';

describe('PasarelaPagos', () => {
  let component: PasarelaPagos;
  let fixture: ComponentFixture<PasarelaPagos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasarelaPagos],
    }).compileComponents();

    fixture = TestBed.createComponent(PasarelaPagos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
