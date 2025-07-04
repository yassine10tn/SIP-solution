import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipationComponent } from './participation.component';

describe('ParticipationComponent', () => {
  let component: ParticipationComponent;
  let fixture: ComponentFixture<ParticipationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});