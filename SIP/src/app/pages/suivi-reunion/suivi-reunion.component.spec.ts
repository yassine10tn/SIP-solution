import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviReunionComponent } from './suivi-reunion.component';

describe('SuiviReunionComponent', () => {
  let component: SuiviReunionComponent;
  let fixture: ComponentFixture<SuiviReunionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiviReunionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuiviReunionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
