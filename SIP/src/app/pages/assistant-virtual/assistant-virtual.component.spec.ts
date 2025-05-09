import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistantVirtualComponent } from './assistant-virtual.component';

describe('AssistantVirtualComponent', () => {
  let component: AssistantVirtualComponent;
  let fixture: ComponentFixture<AssistantVirtualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssistantVirtualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssistantVirtualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
