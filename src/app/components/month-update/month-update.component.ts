import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IGameEvent } from '../../models/bonus.model';
import { IScore } from '../../models/score.model';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { CardSelectorComponent } from '../cards/card-selector/card-selector.component';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-month-update',
  standalone: true,
  imports: [FormsModule, CardSelectorComponent, RouterLink, NgClass],
  templateUrl: './month-update.component.html',
  styleUrl: './month-update.component.scss',
})
export class MonthUpdateComponent implements OnInit {
  readonly apiService = inject(ApiService);
  readonly authService = inject(AuthService);

  // Prix initiaux - valeurs correctes dès le début
  hamsterPrice: number = Math.floor(Math.random() * 10) + 5;
  cagePrice: number = Math.floor(Math.random() * 10) + 1;
  foodPrice: number = Math.floor(Math.random() * 10) + 1;

  // les stocks (nourriture, argent, cage) - valeurs cohérentes
  foodStock: number = 8; // Changé de 5 à 8 pour être cohérent avec resetAll()
  money: number = 60; // Changé de 50 à 60 pour être cohérent avec resetAll()
  cage: number = 1;

  //  propriété pour gérer la fertilité persistante
  private currentFertilityBonus: number = 0;

  // gérer l'état de sauvegarde
  scoreSaved: boolean = false;

  // fin du jeu
  endOfGame: boolean = false;
  monthNumber: number = 1;

  // nombre d'hamsters + hamster par cage
  femaleAdultHamsters: number = 2;
  maleAdultHamsters: number = 2;
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
    (this.femaleAdultHamsters +
      this.femaleSmallHamsters +
      this.maleAdultHamsters +
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

  //  fin de jeu
  private async endGame(): Promise<void> {
    this.endOfGame = true;
    this.femaleAdultHamsters = 0;
    this.femaleSmallHamsters = 0;
    this.maleAdultHamsters = 0;
    this.maleSmallHamsters = 0;

    // Sauvegarder automatiquement le score
    if (!this.scoreSaved) {
      await this.saveScore();
      this.scoreSaved = true;
    }
  }

  //  sauvegarder le score séparément
  private async saveScore(): Promise<void> {
    try {
      this.saveToLocalStorage();
      const playerName = this.authService.getUserName();

      const scoreData: IScore = {
        user_name: playerName || 'Anonyme',
        months: this.monthNumber,
        hamsters: this.hamsterSold + this.allHamstersDead,
      };

      await this.apiService.addScore(scoreData);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du score:', error);
    }
  }

  handleTips() {
    this.displayTips = !this.displayTips;
  }

  // Calcul des morts par suffocation
  calculateSuffocationDeaths(): void {
    const totalHamsters =
      this.femaleAdultHamsters +
      this.maleAdultHamsters +
      this.femaleSmallHamsters +
      this.maleSmallHamsters;
    const maxCapacity = this.cage * 4;

    if (totalHamsters > maxCapacity) {
      const deathsNeeded = Math.min(
        totalHamsters - maxCapacity,
        this.maleAdultHamsters + this.femaleAdultHamsters
      );

      if (this.maleAdultHamsters > 0 && this.femaleAdultHamsters > 0) {
        for (let i = 0; i < deathsNeeded; i++) {
          if (Math.random() < 0.5 && this.maleAdultHamsters > 0) {
            this.maleAdultHamsters--;
            this.deathBySuffocation++;
            this.maleHamsterDeadAll++;
          } else if (this.femaleAdultHamsters > 0) {
            this.femaleAdultHamsters--;
            this.deathBySuffocation++;
            this.femaleHamsterDeadAll++;
          } else if (this.maleAdultHamsters > 0) {
            this.maleAdultHamsters--;
            this.deathBySuffocation++;
            this.maleHamsterDeadAll++;
          }
        }
      } else if (this.maleAdultHamsters > 0) {
        this.deathBySuffocation = Math.min(
          deathsNeeded,
          this.maleAdultHamsters
        );
        this.maleAdultHamsters -= this.deathBySuffocation;
        this.maleHamsterDeadAll += this.deathBySuffocation;
      } else if (this.femaleAdultHamsters > 0) {
        this.deathBySuffocation = Math.min(
          deathsNeeded,
          this.femaleAdultHamsters
        );
        this.femaleAdultHamsters -= this.deathBySuffocation;
        this.femaleHamsterDeadAll += this.deathBySuffocation;
      }
    }
  }

  // Calcul de la consommation de nourriture
  foodConsumedThisMonth: number = 0;

  updateFoodConsumption(): void {
    const adultFoodNeeded =
      (this.femaleAdultHamsters + this.maleAdultHamsters) * 1;
    const smallFoodNeeded =
      (this.femaleSmallHamsters + this.maleSmallHamsters) * 0.5;
    const totalFoodNeeded = adultFoodNeeded + smallFoodNeeded;

    this.foodConsumedThisMonth = Math.min(totalFoodNeeded, this.foodStock);

    if (this.foodStock < totalFoodNeeded) {
      const foodAfterSmalls = Math.max(0, this.foodStock - smallFoodNeeded);
      const adultsCanFeed = Math.floor(foodAfterSmalls / 1);
      const totalAdults = this.femaleAdultHamsters + this.maleAdultHamsters;
      const hamstersToDie = Math.max(0, totalAdults - adultsCanFeed);

      if (hamstersToDie > 0 && totalAdults > 0) {
        const femalesToDie = Math.min(
          Math.round((hamstersToDie * this.femaleAdultHamsters) / totalAdults),
          this.femaleAdultHamsters
        );
        const malesToDie = Math.min(
          hamstersToDie - femalesToDie,
          this.maleAdultHamsters
        );

        this.deathByHunger = femalesToDie + malesToDie;
        this.femaleHamsterDeadAll += femalesToDie;
        this.maleHamsterDeadAll += malesToDie;

        this.femaleAdultHamsters -= femalesToDie;
        this.maleAdultHamsters -= malesToDie;
      }

      this.foodStock = 0;
    } else {
      this.foodStock = this.foodStock - totalFoodNeeded;
    }
  }

  // Gestion de la reproduction
  handleBreeding(): void {
    const potentialMothers = Math.min(
      this.femaleAdultHamsters,
      this.maleAdultHamsters
    );

    for (let i = 0; i < potentialMothers; i++) {
      const baseChance = 0.5; // 50% de base
      const modifier = this.currentFertilityBonus / 100;
      const newChance = Math.max(0.1, Math.min(0.9, baseChance + modifier));

      if (Math.random() < newChance) {
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

    this.currentFertilityBonus *= 0.5;
    if (Math.abs(this.currentFertilityBonus) < 1) {
      this.currentFertilityBonus = 0;
    }
  }

  // Mise à jour du nombre d'hamsters par cage
  updateHamstersByCage(): void {
    this.cage += this.cagesBought;
    // pas de div par 0
    this.hamstersByCage =
      this.cage > 0
        ? (this.femaleAdultHamsters +
            this.femaleSmallHamsters +
            this.maleAdultHamsters +
            this.maleSmallHamsters) /
          this.cage
        : 0;
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
    const maxAffordable = Math.floor(this.money / this.hamsterPrice);
    this.hamstersToBuy = Math.min(
      this.calculateEnoughMoney(value),
      maxAffordable
    );
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
    const maxAffordable = Math.floor(this.money / this.foodPrice);
    this.foodBought = Math.min(this.calculateEnoughMoney(value), maxAffordable);
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
    const maxAffordable = Math.floor(this.money / this.cagePrice);
    this.cagesBought = Math.min(
      this.calculateEnoughMoney(value),
      maxAffordable
    );
    this.canBuyCage = this.money >= this.cagesBought * this.cagePrice;
  }

  getPriceCagesBought(): number {
    return this.canBuyCage ? this.cagesBought * this.cagePrice : 0;
  }

  getMaxAffordableHamsters(): number {
    return Math.floor(this.money / this.hamsterPrice);
  }

  getMaxAffordableFood(): number {
    return Math.floor(this.money / this.foodPrice);
  }

  getMaxAffordableCages(): number {
    return Math.floor(this.money / this.cagePrice);
  }

  // Gestion des ventes d'hamsters
  sellMale(boolean: boolean): void {
    this.wantsToSellMale = boolean;
  }

  setMaleSold(value: number): void {
    this.maleSold = this.calculateEnoughMoney(
      Math.min(value, this.maleAdultHamsters)
    );
  }

  getPriceMaleSold(): number {
    return this.hamsterPrice * this.maleSold;
  }

  sellFemale(boolean: boolean): void {
    this.wantsToSellFemale = boolean;
  }

  setFemaleSold(value: number): void {
    this.femaleSold = this.calculateEnoughMoney(
      Math.min(value, this.femaleAdultHamsters)
    );
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

  // Fonctions pour vendre des hamsters mâles
  incrementMaleSold(): void {
    if (this.maleSold < this.maleAdultHamsters) {
      this.maleSold++;
      this.setMaleSold(this.maleSold);
    }
  }

  decrementMaleSold(): void {
    if (this.maleSold > 0) {
      this.maleSold--;
      this.setMaleSold(this.maleSold);
    }
  }

  // Fonctions pour vendre des hamsters femelles
  incrementFemaleSold(): void {
    if (this.femaleSold < this.femaleAdultHamsters) {
      this.femaleSold++;
      this.setFemaleSold(this.femaleSold);
    }
  }

  decrementFemaleSold(): void {
    if (this.femaleSold > 0) {
      this.femaleSold--;
      this.setFemaleSold(this.femaleSold);
    }
  }

  // Fonctions pour acheter des hamsters
  incrementHamstersToBuy(): void {
    const max = this.getMaxAffordableHamsters();
    if (this.hamstersToBuy < max) {
      this.hamstersToBuy++;
      this.setHamstersToBuy(this.hamstersToBuy);
    }
  }

  decrementHamstersToBuy(): void {
    if (this.hamstersToBuy > 0) {
      this.hamstersToBuy--;
      this.setHamstersToBuy(this.hamstersToBuy);
    }
  }

  // Fonctions pour acheter des cages
  incrementCagesBought(): void {
    const max = this.getMaxAffordableCages();
    if (this.cagesBought < max) {
      this.cagesBought++;
      this.setCagesBought(this.cagesBought);
    }
  }

  decrementCagesBought(): void {
    if (this.cagesBought > 0) {
      this.cagesBought--;
      this.setCagesBought(this.cagesBought);
    }
  }

  // Fonctions pour acheter de la nourriture
  incrementFoodBought(): void {
    const max = this.getMaxAffordableFood();
    if (this.foodBought < max) {
      this.foodBought++;
      this.setFoodBought(this.foodBought);
    }
  }

  decrementFoodBought(): void {
    if (this.foodBought > 0) {
      this.foodBought--;
      this.setFoodBought(this.foodBought);
    }
  }

  isEventMonth(): boolean {
    return this.monthNumber % 4 === 0 && !this.currentMonthEffect;
  }

  onGameEventApplied(event: IGameEvent) {
    this.currentMonthEffect = event;
    this.applyGameEvent(event);
  }

  // Evenemments de cartes
  private applyGameEvent(event: IGameEvent) {
    switch (event.effect.type) {
      case 'money_percentage':
        this.applyMoneyPercentage(event.effect.value);
        break;

      case 'food_percentage':
        this.applyFoodPercentage(event.effect.value);
        break;

      case 'hamster_death_percentage':
        this.applyHamsterDeathPercentage(event.effect.value);
        break;

      case 'hamster_birth_boost':
        this.applyHamsterBirthBoost(event.effect.value);
        break;

      case 'price_modifier':
        this.applyPriceModifierPercentage(
          event.effect.value,
          event.effect.target
        );
        break;
    }
  }

  // Application des bonus/malus d'argent avec calcul équitable
  private applyMoneyPercentage(percentage: number) {
    if (percentage > 0) {
      // Pour les bonus : arrondir vers le haut pour être généreux
      const bonus = Math.ceil(this.money * (percentage / 100));
      this.money = this.money + bonus;
    } else {
      // Pour les malus : arrondir vers le bas pour être moins punitif
      const malus = Math.floor(this.money * (Math.abs(percentage) / 100));
      this.money = Math.max(0, this.money - malus);
    }
  }

  // Application des bonus/malus de nourriture avec calcul équitable
  private applyFoodPercentage(percentage: number) {
    if (percentage > 0) {
      // Pour les bonus : arrondir vers le haut
      const bonus = Math.ceil(this.foodStock * (percentage / 100));
      this.foodStock = this.foodStock + bonus;
    } else {
      // Pour les malus : arrondir vers le bas
      const malus = Math.floor(this.foodStock * (Math.abs(percentage) / 100));
      this.foodStock = Math.max(0, this.foodStock - malus);
    }
  }

  // Application des pourcentages de morts
  private applyHamsterDeathPercentage(percentage: number) {
    const totalAdultHamsters =
      this.maleAdultHamsters + this.femaleAdultHamsters;
    const hamstersToKill = Math.floor(totalAdultHamsters * (percentage / 100));

    for (let i = 0; i < hamstersToKill; i++) {
      if (this.maleAdultHamsters > 0 && this.femaleAdultHamsters > 0) {
        if (Math.random() < 0.5 && this.maleAdultHamsters > 0) {
          this.maleAdultHamsters--;
          this.maleHamsterDeadAll++;
        } else if (this.femaleAdultHamsters > 0) {
          this.femaleAdultHamsters--;
          this.femaleHamsterDeadAll++;
        }
      } else if (this.maleAdultHamsters > 0) {
        this.maleAdultHamsters--;
        this.maleHamsterDeadAll++;
      } else if (this.femaleAdultHamsters > 0) {
        this.femaleAdultHamsters--;
        this.femaleHamsterDeadAll++;
      }
    }
  }

  public hamsterDirections: boolean[] = [];

  getTotalAdultHamsters(): boolean[] {
    const total = this.femaleAdultHamsters + this.maleAdultHamsters;

    if (this.hamsterDirections.length !== total) {
      this.hamsterDirections = Array.from(
        { length: total },
        () => Math.random() < 0.5
      );
    }

    return this.hamsterDirections;
  }

  private applyHamsterBirthBoost(percentage: number) {
    this.currentFertilityBonus += percentage;
    this.currentFertilityBonus = Math.max(
      -80,
      Math.min(80, this.currentFertilityBonus)
    );
    this.handleBreeding();
  }

  // Application des modificateurs de prix
  private applyPriceModifierPercentage(value: number, target?: string) {
    const multiplier = value;

    if (target === 'hamster' || target === 'all') {
      this.hamsterPrice = Math.max(
        1,
        Math.floor(this.hamsterPrice * multiplier)
      );
    }
    if (target === 'cage' || target === 'all') {
      this.cagePrice = Math.max(1, Math.floor(this.cagePrice * multiplier));
    }
    if (target === 'food' || target === 'all') {
      this.foodPrice = Math.max(1, Math.floor(this.foodPrice * multiplier));
    }
  }

  continueToActions() {
    this.showGameEvent = false;
  }

  // check si mois à évènement
  async onNextMonth(): Promise<void> {
    if (this.isEventMonth() && !this.currentMonthEffect) {
      this.showGameEvent = true;
      return;
    }

    window.scrollTo(0, 0);

    // Garder les valeurs des morts avant ce mois
    const previousMaleDeaths = this.maleHamsterDeadAll;
    const previousFemaleDeaths = this.femaleHamsterDeadAll;

    // Reset des compteurs de morts
    this.deathByHunger = 0;
    this.deathBySuffocation = 0;

    // bouffe
    this.foodStock += this.foodBought;
    this.updateFoodConsumption();
    this.calculateSuffocationDeaths();

    //  petits into adults
    this.femaleAdultHamsters += this.femaleSmallHamsters;
    this.maleAdultHamsters += this.maleSmallHamsters;
    this.femaleSmallHamsters = 0;
    this.maleSmallHamsters = 0;

    // Reproduction des survivants
    this.handleBreeding();

    // hamsters  à acheter
    this.femaleAdultHamsters = this.calculateEnoughMoney(
      this.femaleAdultHamsters - this.femaleSold
    );
    this.maleAdultHamsters = this.calculateEnoughMoney(
      this.maleAdultHamsters - this.maleSold
    );
    this.hamsterSold += this.maleSold + this.femaleSold;

    // nouveaux hamsters
    const newMales = Math.floor(this.hamstersToBuy / 2);
    const newFemales = this.hamstersToBuy - newMales;
    this.maleAdultHamsters += newMales;
    this.femaleAdultHamsters += newFemales;

    // morts
    const newMaleDeaths = this.maleHamsterDeadAll - previousMaleDeaths;
    const newFemaleDeaths = this.femaleHamsterDeadAll - previousFemaleDeaths;
    this.allHamstersDead += newMaleDeaths + newFemaleDeaths;

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

    // Reset directions pour nouveau mois
    this.hamsterDirections = [];

    // Mise à jour finale
    this.updateHamstersByCage();
    if (
      this.femaleAdultHamsters <= 0 &&
      this.femaleSmallHamsters <= 0 &&
      this.maleAdultHamsters <= 0 &&
      this.maleSmallHamsters <= 0
    ) {
      await this.endGame();
      return;
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

  async resetAll(): Promise<void> {
    // Prix initiaux
    this.hamsterPrice = Math.floor(Math.random() * 10) + 5;
    this.cagePrice = Math.floor(Math.random() * 10) + 1;
    this.foodPrice = Math.floor(Math.random() * 10) + 1;

    // Stocks initiaux
    this.foodStock = 8;
    this.money = 60;
    this.cage = 1;

    // Reset du flag de sauvegarde
    this.scoreSaved = false;

    // Reset du jeu
    this.endOfGame = false;
    this.monthNumber = 1;

    // Reset des hamsters
    this.femaleAdultHamsters = 2;
    this.maleAdultHamsters = 2;
    this.femaleSmallHamsters = 0;
    this.maleSmallHamsters = 0;

    // Reset des morts
    this.deathBySuffocation = 0;
    this.deathByHunger = 0;
    this.maleHamsterDeadAll = 0;
    this.femaleHamsterDeadAll = 0;

    // Reset de la fertilité persistante
    this.currentFertilityBonus = 0;

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
    this.foodConsumedThisMonth = 0;
  }
}
