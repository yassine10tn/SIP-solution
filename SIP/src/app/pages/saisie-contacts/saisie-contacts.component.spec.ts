import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaisieContactsComponent } from './saisie-contacts.component';

describe('SaisieContactsComponent', () => {
  let component: SaisieContactsComponent;
  let fixture: ComponentFixture<SaisieContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaisieContactsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaisieContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
