import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DjCardComponent } from './dj-card.component';

describe('DjCardComponent', () => {
  let component: DjCardComponent;
  let fixture: ComponentFixture<DjCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DjCardComponent]
    });
    fixture = TestBed.createComponent(DjCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
