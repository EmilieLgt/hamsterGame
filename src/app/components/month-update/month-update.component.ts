import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardSelectorComponent } from '../cards/card-selector/card-selector.component';
import { IGameEvent } from '../../models/bonus.model';
@Component({
  selector: 'app-month-update',
  standalone: true,
  imports: [FormsModule, CardSelectorComponent],
  templateUrl: './month-update.component.html',
  styleUrl: './month-update.component.scss',
})
export class MonthUpdateComponent implements OnInit {
  hamsterPrice: number = Math.floor(Math.random() * 10) + 5;
  cagePrice: number = Math.floor(Math.random() * 10) + 1;
  foodPrice: number = Math.floor(Math.random() * 10) + 1;

  // les stocks (nourriture, argent, cage)
  foodStock: number = 5;
  money: number = 50;
  cage: number = 1;

  // fin du jeu
  endOfGame: boolean = false;
  monthNumber: number = 1;

  // nombre d'hamsters + hamster par cage
  femaleAdultHasmters: number = 2;
  maleAdultHasmters: number = 2;
  femaleSmallHamsters: number = 0;
  maleSmallHamsters: number = 0;

  // nombre de morts
  deathBySuffocation: number = 0;
  deathByHunger: number = 0;
  maleHamsterDeadAll: number = 0;
  femaleHamsterDeadAll: number = 0;

  // variables d'interface
  displayTips: boolean = false;
  showRandomEvent: boolean = false;

  // variables d'achat/vente
  wantsToBuyHamster: boolean = false;
  hamstersToBuy: number = 0;
  canBuyHamster: boolean = true;

  wantsToBuyFood: boolean = false;
  foodBought: number = 0;
  canBuyFood: boolean = true;

  wantsToBuyCage: boolean = false;
  cagesBought: number = 0;
  canBuyCage: boolean = true;

  wantsToSellMale: boolean = false;
  maleSold: number = 0;

  wantsToSellFemale: boolean = false;
  femaleSold: number = 0;

  hamstersByCage: number =
    (this.femaleAdultHasmters +
      this.femaleSmallHamsters +
      this.maleAdultHasmters +
      this.maleSmallHamsters) /
    this.cage;

  monthRecord: number = 0;
  allHamstersDead: number = 0;
  totalHamstersDead: number = 0;
  hamsterSold: number = 0;

  // propriétés pour les événements
  showGameEvent: boolean = false;
  eventProcessed: boolean = false;
  currentMonthEffect: IGameEvent | null = null;

  handleTips() {
    this.displayTips = !this.displayTips;
  }

  // Calcul des morts par suffocation
  calculateSuffocationDeaths(): void {
    const totalHamsters =
      this.femaleAdultHasmters +
      this.maleAdultHasmters +
      this.femaleSmallHamsters +
      this.maleSmallHamsters;
    const maxCapacity = this.cage * 4;

    if (totalHamsters > maxCapacity) {
      const deathsNeeded = Math.min(
        totalHamsters - maxCapacity,
        this.maleAdultHasmters + this.femaleAdultHasmters
      );

      if (this.maleAdultHasmters > 0 && this.femaleAdultHasmters > 0) {
        for (let i = 0; i < deathsNeeded; i++) {
          if (Math.random() < 0.5 && this.maleAdultHasmters > 0) {
            this.maleAdultHasmters--;
            this.deathBySuffocation++;
            this.maleHamsterDeadAll++;
          } else if (this.femaleAdultHasmters > 0) {
            this.femaleAdultHasmters--;
            this.deathBySuffocation++;
            this.femaleHamsterDeadAll++;
          } else if (this.maleAdultHasmters > 0) {
            this.maleAdultHasmters--;
            this.deathBySuffocation++;
            this.maleHamsterDeadAll++;
          }
        }
      } else if (this.maleAdultHasmters > 0) {
        this.deathBySuffocation = Math.min(
          deathsNeeded,
          this.maleAdultHasmters
        );
        this.maleAdultHasmters -= this.deathBySuffocation;
        this.maleHamsterDeadAll += this.deathBySuffocation;
      } else if (this.femaleAdultHasmters > 0) {
        this.deathBySuffocation = Math.min(
          deathsNeeded,
          this.femaleAdultHasmters
        );
        this.femaleAdultHasmters -= this.deathBySuffocation;
        this.femaleHamsterDeadAll += this.deathBySuffocation;
      }
    }
  }

  // Calcul de la consommation de nourriture
  updateFoodConsumption(): void {
    const adultFoodNeeded =
      (this.femaleAdultHasmters + this.maleAdultHasmters) * 1;
    const smallFoodNeeded =
      (this.femaleSmallHamsters + this.maleSmallHamsters) * 0.5;
    const totalFoodNeeded = adultFoodNeeded + smallFoodNeeded;

    if (this.foodStock < totalFoodNeeded) {
      const hamstersCanFeed = Math.floor(this.foodStock);
      const hamstersToDie =
        this.femaleAdultHasmters + this.maleAdultHasmters - hamstersCanFeed;

      if (hamstersToDie > 0) {
        const femalesToDie = Math.min(
          Math.ceil(hamstersToDie / 2),
          this.femaleAdultHasmters
        );
        const malesToDie = Math.min(
          hamstersToDie - femalesToDie,
          this.maleAdultHasmters
        );

        this.deathByHunger = femalesToDie + malesToDie;
        this.femaleHamsterDeadAll += femalesToDie;
        this.maleHamsterDeadAll += malesToDie;

        this.femaleAdultHasmters -= femalesToDie;
        this.maleAdultHasmters -= malesToDie;
      }

      this.foodStock = 0;
    } else {
      this.foodStock = this.foodStock - totalFoodNeeded;
    }
  }

  // Gestion de la reproduction
  handleBreeding(): void {
    const potentialMothers = Math.min(
      this.femaleAdultHasmters,
      this.maleAdultHasmters
    );

    for (let i = 0; i < potentialMothers; i++) {
      if (Math.random() < 0.5) {
        const litterSize = Math.floor(Math.random() * 2) + 1;

        for (let j = 0; j < litterSize; j++) {
          if (Math.random() < 0.5) {
            this.maleSmallHamsters++;
          } else {
            this.femaleSmallHamsters++;
          }
        }
      }
    }
  }

  // Mise à jour du nombre d'hamsters par cage
  updateHamstersByCage(): void {
    this.cage += this.cagesBought;
    this.hamstersByCage =
      (this.femaleAdultHasmters +
        this.femaleSmallHamsters +
        this.maleAdultHasmters +
        this.maleSmallHamsters) /
      this.cage;
  }

  // Utilitaires
  calculateEnoughMoney(value: number): number {
    return Math.max(0, Math.floor(value));
  }

  // Gestion des achats d'hamsters
  buyHamster(boolean: boolean): void {
    this.wantsToBuyHamster = boolean;
    this.canBuyHamster = this.money >= this.hamsterPrice;
  }

  setHamstersToBuy(value: number): void {
    this.hamstersToBuy = this.calculateEnoughMoney(value);
    this.canBuyHamster = this.money >= this.hamstersToBuy * this.hamsterPrice;
  }

  getPriceHamstersBought(): number {
    return this.hamstersToBuy * this.hamsterPrice;
  }

  // Gestion des achats de nourriture
  buyFood(boolean: boolean): void {
    this.wantsToBuyFood = boolean;
    this.canBuyFood = this.money >= this.foodPrice;
  }

  setFoodBought(value: number): void {
    this.foodBought = this.calculateEnoughMoney(value);
    this.canBuyFood = this.money >= this.foodBought * this.foodPrice;
  }

  getPriceOfFoodBought(): number {
    return this.foodBought * this.foodPrice;
  }

  // Gestion des achats de cages
  buyCage(boolean: boolean): void {
    if (boolean === true) {
      this.wantsToBuyCage = true;
    } else {
      this.wantsToBuyCage = false;
    }
    this.canBuyCage = this.money >= this.cagePrice;
  }

  setCagesBought(value: number): void {
    this.cagesBought = this.calculateEnoughMoney(value);
    this.canBuyCage = this.money >= this.cagesBought * this.cagePrice;
  }

  getPriceCagesBought(): number {
    return this.canBuyCage ? this.cagesBought * this.cagePrice : 0;
  }

  // Gestion des ventes d'hamsters
  sellMale(boolean: boolean): void {
    this.wantsToSellMale = boolean;
  }

  setMaleSold(value: number): void {
    this.maleSold = this.calculateEnoughMoney(
      Math.min(value, this.maleAdultHasmters)
    );
    this.hamsterSold += value;
  }

  getPriceMaleSold(): number {
    return this.hamsterPrice * this.maleSold;
  }

  sellFemale(boolean: boolean): void {
    this.wantsToSellFemale = boolean;
  }

  setFemaleSold(value: number): void {
    this.femaleSold = this.calculateEnoughMoney(
      Math.min(value, this.femaleAdultHasmters)
    );
    this.hamsterSold += value;
  }

  getPriceFemaleSold(): number {
    return this.hamsterPrice * this.femaleSold;
  }

  // Calcul des finances
  getMoneyForNextMonth(): number {
    return (
      this.money +
      this.getPriceFemaleSold() +
      this.getPriceMaleSold() -
      this.getPriceCagesBought() -
      this.getPriceOfFoodBought() -
      this.getPriceHamstersBought()
    );
  }

  getFoodForNextMonth(): number {
    return this.foodStock + this.foodBought;
  }

  // Annulation des actions
  cancelBuyFood() {
    this.foodBought = 0;
    this.wantsToBuyFood = false;
    this.canBuyFood = true;
  }

  cancelBuyHamster() {
    this.hamstersToBuy = 0;
    this.wantsToBuyHamster = false;
    this.canBuyHamster = true;
  }

  cancelBuyCage() {
    this.cagesBought = 0;
    this.wantsToBuyCage = false;
    this.canBuyCage = true;
  }

  // Evenements
  isEventMonth(): boolean {
    return this.monthNumber % 4 === 0 && !this.currentMonthEffect;
  }

  onGameEventApplied(event: IGameEvent) {
    this.currentMonthEffect = event;
    this.applyGameEvent(event);
  }

  private applyGameEvent(event: IGameEvent) {
    switch (event.effect.type) {
      case 'money':
        this.money = Math.max(0, this.money + event.effect.value);
        break;

      case 'food':
        this.foodStock = Math.max(0, this.foodStock + event.effect.value);
        break;

      case 'hamster_death':
        this.applyHamsterDeath(event.effect.value);
        break;

      case 'hamster_birth':
        this.applyHamsterBirth(event.effect.value);
        break;

      case 'price_modifier':
        this.applyPriceModifier(event.effect.value, event.effect.target);
        break;
    }
  }

  private applyHamsterDeath(deaths: number) {
    for (let i = 0; i < deaths; i++) {
      if (this.maleAdultHasmters > 0 && Math.random() < 0.5) {
        this.maleAdultHasmters--;
        this.maleHamsterDeadAll++;
      } else if (this.femaleAdultHasmters > 0) {
        this.femaleAdultHasmters--;
        this.femaleHamsterDeadAll++;
      }
    }
  }

  private applyHamsterBirth(bonus: number) {
    const potentialMothers = Math.min(
      this.femaleAdultHasmters,
      this.maleAdultHasmters
    );

    for (let i = 0; i < potentialMothers; i++) {
      const baseChance = 0.5;
      const modifiedChance =
        bonus > 0 ? baseChance + 0.3 : Math.max(0.1, baseChance - 0.3);

      if (Math.random() < modifiedChance) {
        const litterSize = Math.floor(Math.random() * (bonus > 0 ? 3 : 2)) + 1;

        for (let j = 0; j < litterSize; j++) {
          if (Math.random() < 0.5) {
            this.maleSmallHamsters++;
          } else {
            this.femaleSmallHamsters++;
          }
        }
      }
    }
  }

  private applyPriceModifier(modifier: number, target?: string) {
    if (target === 'hamster' || target === 'all') {
      this.hamsterPrice = Math.floor(this.hamsterPrice * modifier);
    }
    if (target === 'cage' || target === 'all') {
      this.cagePrice = Math.floor(this.cagePrice * modifier);
    }
    if (target === 'food' || target === 'all') {
      this.foodPrice = Math.floor(this.foodPrice * modifier);
    }
  }

  continueToActions() {
    this.showGameEvent = false;
  }
  // check si mois à évènement
  onNextMonth(): void {
    // Vérifier si c'est un mois d'événement au début du mois
    if (this.isEventMonth() && !this.currentMonthEffect) {
      this.showGameEvent = true;
      return; // Stopper ici, attendre la sélection de l'événement
    }

    window.scrollTo(0, 0);

    // Garder les valeurs des morts avant ce mois
    const previousMaleDeaths = this.maleHamsterDeadAll;
    const previousFemaleDeaths = this.femaleHamsterDeadAll;

    // Attribution des nouveaux hamsters achetés
    for (let i = 0; i < this.hamstersToBuy; i++) {
      if (Math.random() < 0.5) {
        this.maleAdultHasmters++;
      } else {
        this.femaleAdultHasmters++;
      }
    }

    // Reset des compteurs de morts
    this.deathByHunger = 0;
    this.deathBySuffocation = 0;

    // Mise à jour de la nourriture et morts
    this.foodStock += this.foodBought;
    this.updateFoodConsumption();
    this.calculateSuffocationDeaths();

    // Faire grandir les petits
    this.femaleAdultHasmters += this.femaleSmallHamsters;
    this.maleAdultHasmters += this.maleSmallHamsters;
    this.femaleSmallHamsters = 0;
    this.maleSmallHamsters = 0;

    // Compter seulement les nouveaux morts de ce mois
    const newMaleDeaths = this.maleHamsterDeadAll - previousMaleDeaths;
    const newFemaleDeaths = this.femaleHamsterDeadAll - previousFemaleDeaths;
    this.allHamstersDead += newMaleDeaths + newFemaleDeaths;

    // Reproduction
    this.handleBreeding();

    // Mise à jour après ventes
    this.femaleAdultHasmters = this.calculateEnoughMoney(
      this.femaleAdultHasmters - this.femaleSold
    );
    this.maleAdultHasmters = this.calculateEnoughMoney(
      this.maleAdultHasmters - this.maleSold
    );

    // Mise à jour des stocks
    this.money = this.getMoneyForNextMonth();
    this.cage += this.cagesBought;

    // Reset des actions
    this.hamstersToBuy = 0;
    this.wantsToBuyHamster = false;
    this.cagesBought = 0;
    this.wantsToBuyCage = false;
    this.foodBought = 0;
    this.wantsToBuyFood = false;
    this.maleSold = 0;
    this.wantsToSellMale = false;
    this.femaleSold = 0;
    this.wantsToSellFemale = false;

    // Mise à jour finale
    this.updateHamstersByCage();

    // Vérification de fin de jeu
    if (
      this.femaleAdultHasmters <= 0 &&
      this.femaleSmallHamsters <= 0 &&
      this.maleAdultHasmters <= 0 &&
      this.maleSmallHamsters <= 0
    ) {
      this.endOfGame = true;
      this.femaleAdultHasmters = 0;
      this.femaleSmallHamsters = 0;
      this.maleAdultHasmters = 0;
      this.maleSmallHamsters = 0;
    }

    // Mise à jour du mois et des prix
    this.monthNumber++;
    this.hamsterPrice = Math.floor(Math.random() * 10) + 1;
    this.cagePrice = Math.floor(Math.random() * 10) + 1;
    this.foodPrice = Math.floor(Math.random() * 10) + 1;

    // Reset l'événement pour le prochain cycle
    if (this.monthNumber % 4 === 1) {
      this.eventProcessed = false;
      this.currentMonthEffect = null;
    }
  }

  ngOnInit() {
    // record mois
    const savedMonthRecord: any = localStorage.getItem('monthRecord');
    this.monthRecord = JSON.parse(savedMonthRecord);
    // morts
    const savedDeaths = localStorage.getItem('totalDeaths');
    this.totalHamstersDead = savedDeaths ? JSON.parse(savedDeaths) : 0;
    this.allHamstersDead = 0;
  }

  saveToLocalStorage() {
    // record mois
    if (this.monthNumber > this.monthRecord) {
      localStorage.setItem('monthRecord', JSON.stringify(this.monthNumber));
    }
    // mise à jour morts
    this.totalHamstersDead += this.allHamstersDead;
    localStorage.setItem('totalDeaths', JSON.stringify(this.totalHamstersDead));
  }

  resetAll(): void {
    this.saveToLocalStorage();
    // Prix des items (random entre 1 et 10)
    this.hamsterPrice = Math.floor(Math.random() * 10) + 5;
    this.cagePrice = Math.floor(Math.random() * 10) + 1;
    this.foodPrice = Math.floor(Math.random() * 10) + 1;

    // Stocks initiaux
    this.foodStock = 5;
    this.money = 50;
    this.cage = 1;

    // Reset du jeu
    this.endOfGame = false;
    this.monthNumber = 1;

    // Reset des hamsters
    this.femaleAdultHasmters = 2;
    this.maleAdultHasmters = 2;
    this.femaleSmallHamsters = 0;
    this.maleSmallHamsters = 0;

    // Reset des morts
    this.deathBySuffocation = 0;
    this.deathByHunger = 0;
    this.maleHamsterDeadAll = 0;
    this.femaleHamsterDeadAll = 0;

    // Reset des achats/ventes
    this.wantsToBuyHamster = false;
    this.hamstersToBuy = 0;
    this.canBuyHamster = true;

    this.wantsToBuyFood = false;
    this.foodBought = 0;
    this.canBuyFood = true;

    this.wantsToBuyCage = false;
    this.cagesBought = 0;
    this.canBuyCage = true;

    this.wantsToSellMale = false;
    this.maleSold = 0;

    this.wantsToSellFemale = false;
    this.femaleSold = 0;

    // Reset des événements
    this.showGameEvent = false;
    this.eventProcessed = false;
    this.currentMonthEffect = null;

    this.updateHamstersByCage();
    this.ngOnInit();
    this.allHamstersDead = 0;
    this.hamsterSold = 0;
  }
}
