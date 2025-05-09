import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissaireListComponent } from './commissaire-list.component';

describe('CommissaireListComponent', () => {
  let component: CommissaireListComponent;
  let fixture: ComponentFixture<CommissaireListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommissaireListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommissaireListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
