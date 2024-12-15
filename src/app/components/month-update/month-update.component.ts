import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-month-update',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './month-update.component.html',
  styleUrl: './month-update.component.scss',
})
export class MonthUpdateComponent {
  // prix des hamsters, cages, nourriture entre 1 et 10 random
  hamsterPrice: number = Math.floor(Math.random() * 10) + 5;
  cagePrice: number = Math.floor(Math.random() * 10) + 1;
  foodPrice: number = Math.floor(Math.random() * 10) + 1;

  // les stocks (nourriture, argent, cage)
  foodStock: number = 5;
  money: number = 50;
  cage: number = 1;

  // fin du jeu
  endOfGame: boolean = false;
  // le mois
  monthNumber: number = 1;
  // nombre d'hamsters + hamster par cage
  femaleAdultHasmters: number = 2;
  maleAdultHasmters: number = 2;
  femaleSmallHamsters: number = 0;
  maleSmallHamsters: number = 0;

  hamstersByCage: number =
    (this.femaleAdultHasmters +
      this.femaleSmallHamsters +
      this.maleAdultHasmters +
      this.maleSmallHamsters) /
    this.cage;

  // nombre de morts
  deathBySuffocation: number = 0;
  deathByHunger: number = 0;

  //
  displayTips: boolean = false;

  handleTips() {
    this.displayTips = !this.displayTips;
  }

  // calcul des morts
  calculateSuffocationDeaths(): void {
    const totalHamsters =
      this.femaleAdultHasmters +
      this.maleAdultHasmters +
      this.femaleSmallHamsters +
      this.maleSmallHamsters;
    const maxCapacity = this.cage * 4; // Augmenté de 3 à 4 hamsters par cage

    if (totalHamsters > maxCapacity) {
      const deathsNeeded = Math.min(
        totalHamsters - maxCapacity,
        this.maleAdultHasmters + this.femaleAdultHasmters
      );

      // Si on a des mâles et des femelles, on choisit au hasard
      if (this.maleAdultHasmters > 0 && this.femaleAdultHasmters > 0) {
        for (let i = 0; i < deathsNeeded; i++) {
          if (Math.random() < 0.5 && this.maleAdultHasmters > 0) {
            this.maleAdultHasmters--;
            this.deathBySuffocation++;
          } else if (this.femaleAdultHasmters > 0) {
            this.femaleAdultHasmters--;
            this.deathBySuffocation++;
          } else if (this.maleAdultHasmters > 0) {
            this.maleAdultHasmters--;
            this.deathBySuffocation++;
          }
        }
      }
      // Si on n'a que des mâles
      else if (this.maleAdultHasmters > 0) {
        this.deathBySuffocation = Math.min(
          deathsNeeded,
          this.maleAdultHasmters
        );
        this.maleAdultHasmters -= this.deathBySuffocation;
      }
      // Si on n'a que des femelles
      else if (this.femaleAdultHasmters > 0) {
        this.deathBySuffocation = Math.min(
          deathsNeeded,
          this.femaleAdultHasmters
        );
        this.femaleAdultHasmters -= this.deathBySuffocation;
      }
    }
  }

  calculateStarvationDeaths(): void {
    if (this.foodStock === 0) {
      // Calculer le nombre total de hamsters adultes qui vont mourir
      const totalAdultHamsters =
        this.maleAdultHasmters + this.femaleAdultHasmters;
      const deathsNeeded = Math.min(
        totalAdultHamsters,
        Math.ceil(totalAdultHamsters * 0.5)
      ); // 50% des hamsters meurent de faim

      // Si on a des mâles et des femelles, on choisit au hasard
      if (this.maleAdultHasmters > 0 && this.femaleAdultHasmters > 0) {
        for (let i = 0; i < deathsNeeded; i++) {
          if (Math.random() < 0.5 && this.maleAdultHasmters > 0) {
            this.maleAdultHasmters--;
            this.deathByHunger++;
          } else if (this.femaleAdultHasmters > 0) {
            this.femaleAdultHasmters--;
            this.deathByHunger++;
          } else if (this.maleAdultHasmters > 0) {
            this.maleAdultHasmters--;
            this.deathByHunger++;
          }
        }
      }
      // Si on n'a que des mâles
      else if (this.maleAdultHasmters > 0) {
        this.deathByHunger = Math.min(deathsNeeded, this.maleAdultHasmters);
        this.maleAdultHasmters -= this.deathByHunger;
      }
      // Si on n'a que des femelles
      else if (this.femaleAdultHasmters > 0) {
        this.deathByHunger = Math.min(deathsNeeded, this.femaleAdultHasmters);
        this.femaleAdultHasmters -= this.deathByHunger;
      }
    }
  }
  // calcul de la nourriture mangée
  updateFoodConsumption(): void {
    const adultFoodNeeded =
      (this.femaleAdultHasmters + this.maleAdultHasmters) * 1; // 1kg adulte
    const smallFoodNeeded =
      (this.femaleSmallHamsters + this.maleSmallHamsters) * 0.5; // 500g enfant
    const totalFoodNeeded = adultFoodNeeded + smallFoodNeeded;

    if (this.foodStock < totalFoodNeeded) {
      this.deathByHunger = this.femaleAdultHasmters;
      this.foodStock = 0;
    } else {
      this.foodStock = this.foodStock - totalFoodNeeded;
    }
  }

  // calcul reproduction (à revoir fait par gpt)
  handleBreeding(): void {
    // Only adult hamsters can breed
    const potentialMothers = Math.min(
      this.femaleAdultHasmters,
      this.maleAdultHasmters
    );

    for (let i = 0; i < potentialMothers; i++) {
      // 40% chance of successful breeding per pair
      if (Math.random() < 0.5) {
        // Generate 2 à 4 bébés
        const litterSize = Math.floor(Math.random() * 2) + 1;

        for (let j = 0; j < litterSize; j++) {
          // 50/50 chance for each baby's gender
          if (Math.random() < 0.5) {
            this.maleSmallHamsters++;
          } else {
            this.femaleSmallHamsters++;
          }
        }
      }
    }
  }

  // hamster par cage calcul
  updateHamstersByCage(): void {
    this.cage += this.cagesBought;
    this.hamstersByCage =
      (this.femaleAdultHasmters +
        this.femaleSmallHamsters +
        this.maleAdultHasmters +
        this.maleSmallHamsters) /
      this.cage;
  }
  // vérifier si assez d'argent
  calculateEnoughMoney(value: number): number {
    return Math.max(0, Math.floor(value));
  }

  // achat hamster (sexe au hasard)
  wantsToBuyHamster: boolean = false;
  hamstersToBuy: number = 0;
  canBuyHamster: boolean = true;

  buyHamster(boolean: boolean): void {
    this.wantsToBuyHamster = boolean;
    this.canBuyHamster = this.money >= this.hamsterPrice;
  }

  setHamstersToBuy(value: number): void {
    this.hamstersToBuy = this.calculateEnoughMoney(value);
    // update canBuyHamster avec le prix total -> si c'est inférieur à la money ça donne false
    this.canBuyHamster = this.money >= this.hamstersToBuy * this.hamsterPrice;
  }
  getPriceHamstersBought(): number {
    return this.hamstersToBuy * this.hamsterPrice;
  }

  // achat nourriture
  wantsToBuyFood: boolean = false;
  foodBought: number = 0;
  canBuyFood: boolean = true;
  buyFood(boolean: boolean): void {
    if (boolean === true) {
      this.wantsToBuyFood = true;
    } else {
      this.wantsToBuyFood = false;
    }
    if (this.money > this.foodPrice) {
      this.canBuyCage;
    }
  }
  setFoodBought(value: number): void {
    this.foodBought = this.calculateEnoughMoney(value);
    this.canBuyFood = this.money >= this.foodBought * this.foodPrice;
  }
  getPriceOfFoodBought(): number {
    return this.foodBought * this.foodPrice;
  }

  // achat cage (faire apparaitre le combien ? + gérer le prix)
  wantsToBuyCage: boolean = false;
  cagesBought: number = 0;
  canBuyCage: boolean = true;
  buyCage(boolean: boolean): void {
    if (boolean === true) {
      this.wantsToBuyCage = true;
    } else if (boolean === false) {
      this.wantsToBuyCage = false;
    }
    if (this.money > this.cagePrice) {
      this.canBuyCage;
    }
    if (this.money < this.cagePrice * this.cagesBought) {
      this.canBuyCage = false;
    }
  }
  setCagesBought(value: number): void {
    this.cagesBought = this.calculateEnoughMoney(value);
    this.canBuyCage = this.money >= this.cagesBought * this.cagePrice;
  }
  getPriceCagesBought(): number {
    if (this.canBuyCage) {
      return this.cagesBought * this.cagePrice;
    } else return 0;
  }

  // vendre males
  wantsToSellMale: boolean = false;
  maleSold: number = 0;
  sellMale(boolean: boolean): void {
    if (boolean === true) {
      this.wantsToSellMale = true;
    } else {
      this.wantsToSellMale = false;
      console.log('hi in false');
    }
  }
  setMaleSold(value: number): void {
    this.maleSold = this.calculateEnoughMoney(
      Math.min(value, this.maleAdultHasmters)
    );
  }
  getPriceMaleSold(): number {
    return this.hamsterPrice * this.maleSold;
  }

  // vendre femelles
  wantsToSellFemale: boolean = false;
  femaleSold: number = 0;
  sellFemale(boolean: boolean): void {
    if (boolean === true) {
      this.wantsToSellFemale = true;
    } else {
      this.wantsToSellFemale = false;
      console.log('hi in false');
    }
  }
  setFemaleSold(value: number): void {
    this.femaleSold = this.calculateEnoughMoney(
      Math.min(value, this.femaleAdultHasmters)
    );
  }
  getPriceFemaleSold(): number {
    return this.hamsterPrice * this.femaleSold;
  }

  // calcul du coup / depense du mois
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

  cancelBuyFood() {
    this.foodBought = 0;
    this.wantsToBuyFood = false;
    this.setFoodBought(0);
    this.canBuyFood = true;
  }
  cancelBuyHamster() {
    this.hamstersToBuy = 0;
    this.wantsToBuyHamster = false;
    this.canBuyHamster = true;
    this.setHamstersToBuy(0);
  }
  cancelBuyCage() {
    this.cagesBought = 0;
    this.wantsToBuyCage = false;
    this.setCagesBought(0);
    this.canBuyCage = true;
  }
  // prochain mois
  onNextMonth(): void {
    window.scrollTo(0, 0);
    // update le mois, mettre à jour prix
    this.monthNumber++;
    this.hamsterPrice = Math.floor(Math.random() * 10) + 1;
    this.cagePrice = Math.floor(Math.random() * 10) + 1;
    this.foodPrice = Math.floor(Math.random() * 10) + 1;

    // donne un hamster male ou femelle au hasard dans les hamsters achetés
    for (let i = 0; i < this.hamstersToBuy; i++) {
      if (Math.random() < 0.5) {
        this.maleAdultHasmters++;
      } else {
        this.femaleAdultHasmters++;
      }
    }

    // reset les morts
    this.deathByHunger = 0;
    this.deathBySuffocation = 0;
    // calcule les morts
    this.calculateSuffocationDeaths();
    this.calculateStarvationDeaths();

    // Déplacer les petits vers les adultes
    this.femaleAdultHasmters += this.femaleSmallHamsters;
    this.maleAdultHasmters += this.maleSmallHamsters;

    // Réinitialiser le nombre de petits
    this.femaleSmallHamsters = 0;
    this.maleSmallHamsters = 0;

    // calcule la reproduction
    this.handleBreeding();
    // update nbre de male et femelle, ajout des enfants vers les adultes
    this.femaleAdultHasmters = this.calculateEnoughMoney(
      this.femaleAdultHasmters - this.femaleSold - this.deathByHunger
    );
    this.maleAdultHasmters = this.calculateEnoughMoney(
      this.maleAdultHasmters -
        this.maleSold -
        this.deathByHunger -
        this.deathBySuffocation
    );

    // update des stocks
    this.updateFoodConsumption();
    this.foodStock += this.foodBought;
    this.money = this.getMoneyForNextMonth();
    this.cage += this.cagesBought;

    // reset les achats et enlève input
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

    // recalcule les hamsters par cage
    this.updateHamstersByCage();

    // Vérification de fin de jeu
    if (
      this.femaleAdultHasmters <= 0 &&
      this.femaleSmallHamsters <= 0 &&
      this.maleAdultHasmters <= 0 &&
      this.maleSmallHamsters <= 0
    ) {
      this.endOfGame = true;
      // Forcer les valeurs à 0 pour être sûr
      this.femaleAdultHasmters = 0;
      this.femaleSmallHamsters = 0;
      this.maleAdultHasmters = 0;
      this.maleSmallHamsters = 0;
    }
  }

  resetAll(): void {
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

    // Recalcul des hamsters par cage
    this.updateHamstersByCage();
  }
}
