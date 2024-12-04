import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthUpdateComponent } from './month-update.component';

describe('MonthUpdateComponent', () => {
  let component: MonthUpdateComponent;
  let fixture: ComponentFixture<MonthUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
