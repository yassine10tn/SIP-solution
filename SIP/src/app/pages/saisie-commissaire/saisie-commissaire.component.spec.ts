import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaisieCommissaireComponent } from './saisie-commissaire.component';

describe('SaisieCommissaireComponent', () => {
  let component: SaisieCommissaireComponent;
  let fixture: ComponentFixture<SaisieCommissaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaisieCommissaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaisieCommissaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
