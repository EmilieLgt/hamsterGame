import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KidGamePageComponent } from './kid-game-page.component';

describe('KidGamePageComponent', () => {
  let component: KidGamePageComponent;
  let fixture: ComponentFixture<KidGamePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KidGamePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KidGamePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
