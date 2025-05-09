import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaisieRepresentantComponent } from './saisie-representant.component';

describe('SaisieRepresentantComponent', () => {
  let component: SaisieRepresentantComponent;
  let fixture: ComponentFixture<SaisieRepresentantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaisieRepresentantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaisieRepresentantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
