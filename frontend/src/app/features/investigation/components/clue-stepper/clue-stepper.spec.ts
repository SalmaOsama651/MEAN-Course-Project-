import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClueStepper } from './clue-stepper';

describe('ClueStepper', () => {
  let component: ClueStepper;
  let fixture: ComponentFixture<ClueStepper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClueStepper],
    }).compileComponents();

    fixture = TestBed.createComponent(ClueStepper);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
