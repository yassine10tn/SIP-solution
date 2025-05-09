import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationReunionComponent } from './creation-reunion.component';

describe('CreationReunionComponent', () => {
  let component: CreationReunionComponent;
  let fixture: ComponentFixture<CreationReunionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationReunionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationReunionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
