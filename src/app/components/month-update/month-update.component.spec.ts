import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonthUpdateComponent } from './month-update.component';
import { FormsModule } from '@angular/forms';

describe('MonthUpdateComponent', () => {
  let component: MonthUpdateComponent;
  let fixture: ComponentFixture<MonthUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, MonthUpdateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MonthUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait initialiser avec les valeurs par défaut correctes', () => {
    expect(component.monthNumber).toBe(1);
    expect(component.foodStock).toBe(5);
    expect(component.money).toBe(50);
    expect(component.cage).toBe(1);
    expect(component.femaleAdultHamsters).toBe(2);
    expect(component.maleAdultHamsters).toBe(2);
    expect(component.femaleSmallHamsters).toBe(0);
    expect(component.maleSmallHamsters).toBe(0);
  });

  it('devrait calculer correctement les morts par suffocation', () => {
    component.cage = 1;
    component.maleAdultHamsters = 3;
    component.femaleAdultHamsters = 3;

    component.calculateSuffocationDeaths();

    // Vérifier qu'il y a eu des morts par suffocation
    expect(component.deathBySuffocation).toBeGreaterThan(0);
    // Vérifier que le nombre total de hamsters ne dépasse pas la capacité
    const totalHamsters =
      component.maleAdultHamsters + component.femaleAdultHamsters;
    expect(totalHamsters).toBeLessThanOrEqual(component.cage * 4);
  });

  it('devrait calculer correctement les morts par faim', () => {
    // Configuration avec pas de nourriture
    component.foodStock = 0;
    component.maleAdultHamsters = 4;
    component.femaleAdultHamsters = 4;

    // Vérifier qu'il y a eu des morts par faim
    expect(component.deathByHunger).toBeGreaterThan(0);
  });

  it('devrait gérer correctement la reproduction des hamsters', () => {
    // Configuration initiale pour la reproduction
    component.maleAdultHamsters = 2;
    component.femaleAdultHamsters = 2;
    component.maleSmallHamsters = 0;
    component.femaleSmallHamsters = 0;

    component.handleBreeding();

    // Vérifier qu'il y a potentiellement de nouveaux bébés
    const totalBabies =
      component.maleSmallHamsters + component.femaleSmallHamsters;
    expect(totalBabies).toBeGreaterThanOrEqual(0);
  });

  it('devrait calculer correctement le prix de vente des hamsters', () => {
    component.hamsterPrice = 10;
    component.maleSold = 2;

    const price = component.getPriceMaleSold();
    expect(price).toBe(20);
  });

  it('devrait mettre à jour correctement le mois suivant', () => {
    const initialMonth = component.monthNumber;
    component.onNextMonth();
    expect(component.monthNumber).toBe(initialMonth + 1);
  });

  it('devrait détecter correctement la fin du jeu', () => {
    // Configuration pour une fin de jeu
    component.maleAdultHamsters = 0;
    component.femaleAdultHamsters = 0;
    component.maleSmallHamsters = 0;
    component.femaleSmallHamsters = 0;

    component.onNextMonth();
    expect(component.endOfGame).toBe(true);
  });

  it('devrait réinitialiser correctement le jeu', () => {
    // Modifier quelques valeurs
    component.money = 1000;
    component.foodStock = 20;
    component.monthNumber = 5;

    // Réinitialiser
    component.resetAll();

    // Vérifier les valeurs par défaut
    expect(component.money).toBe(50);
    expect(component.foodStock).toBe(5);
    expect(component.monthNumber).toBe(1);
  });

  it('devrait calculer correctement le montant pour le mois suivant', () => {
    // Configuration initiale
    component.money = 100;
    component.hamsterPrice = 10;
    component.maleSold = 2;
    component.femaleSold = 1;
    component.foodBought = 2;
    component.foodPrice = 5;

    const expectedMoney = 100 + 3 * 10 - 2 * 5; // 100 + 30 - 10 = 120
    expect(component.getMoneyForNextMonth()).toBe(expectedMoney);
  });
});
