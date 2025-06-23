import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemineurComponent } from './demineur.component';

describe('DemineurComponent', () => {
  let component: DemineurComponent;
  let fixture: ComponentFixture<DemineurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemineurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemineurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
