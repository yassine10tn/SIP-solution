import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultLayoutComponentComponent } from './default-layout-component.component';

describe('DefaultLayoutComponentComponent', () => {
  let component: DefaultLayoutComponentComponent;
  let fixture: ComponentFixture<DefaultLayoutComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultLayoutComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultLayoutComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
