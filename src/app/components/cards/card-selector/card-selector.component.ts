import { Component, OnInit, output } from '@angular/core';
import { OneCardComponent } from '../one-card/one-card.component';
import { IBonus, IGameEvent } from '../../../models/bonus.model';

@Component({
  selector: 'app-card-selector',
  standalone: true,
  imports: [OneCardComponent],
  templateUrl: './card-selector.component.html',
  styleUrl: './card-selector.component.scss',
})
export class CardSelectorComponent implements OnInit {
  selectedCardIndex: number | null = null;

  eventApplied = output<IGameEvent>();
  continueToGame = output<void>();

  gameEvents: IGameEvent[] = [
    // argent
    {
      title: 'Bonus',
      text: 'Hausse de salaire. Votre revenu augmente de 30% immédiatement, merci patron !',
      effect: { type: 'money_percentage', value: 30 },
    },
    {
      title: 'Bonus',
      text: 'Prime exceptionnelle ! Votre revenu augmente immédiatement de 40%, merci patron !',
      effect: { type: 'money_percentage', value: 40 },
    },
    {
      title: 'Malus',
      text: 'Taxe sur les propriétaires de cages ! Prélèvement de -30% de votre fortune',
      effect: { type: 'money_percentage', value: -30 },
    },
    {
      title: 'Malus',
      text: "Visite de la CAF. Vous n'avez pas déclaré tous vos hamsters colocataires pour vos APL, 50% de votre argent est saisi",
      effect: { type: 'money_percentage', value: -50 },
    },
    // bouffe
    {
      title: 'Bonus',
      text: 'Don de nourriture de la ligue de protection des hamsters. +50% de nourriture !',
      effect: { type: 'food_percentage', value: 50 },
    },
    {
      title: 'Bonus',
      text: 'Carrottes abandonnées ! Vos stocks alimentaires augmentent de +30%',
      effect: { type: 'food_percentage', value: 30 },
    },
    {
      title: 'Malus',
      text: 'Des goinfres sont parmi les hamsters ! Ils mangent 25% de vos réserves',
      effect: { type: 'food_percentage', value: -25 },
    },
    {
      title: 'Malus',
      text: 'Inondations. Le stock de croquettes en prend un coup. 50% de votre stock est fichu. ',
      effect: { type: 'food_percentage', value: -50 },
    },
    // hamsters
    {
      title: 'Malus',
      text: 'Épidémie de COVID-32 : 25% de hamsters morts',
      effect: { type: 'hamster_death_percentage', value: 25 },
    },
    {
      title: 'Malus',
      text: "Cages mal fermées. Tous les hamsters tentent de s'échapper. Vous arrivez à temps pour en sauver la moitié.",
      effect: { type: 'hamster_death_percentage', value: 50 },
    },

    {
      title: 'Bonus',
      text: 'Promo chez Jardiland. Hamsters à -50%',
      effect: { type: 'price_modifier', value: 0.5, target: 'hamster' },
    },
    // reproduction
    {
      title: 'Bonus',
      text: 'Saison des amours ! +50% de chance de reproduction pour les prochains mois',
      effect: { type: 'hamster_birth_boost', value: 50 },
    },
    {
      title: 'Malus',
      text: 'Burn out chez les femelles ! -60% de chance de reproduction pour les prochains mois',
      effect: { type: 'hamster_birth_boost', value: -60 },
    },
    // morts
    {
      title: 'Malus',
      text: "Cages mal fermées. Tous les hamsters tentent de s'échapper. Vous arrivez à temps pour en sauver la moitié.",
      effect: { type: 'hamster_death_percentage', value: 50 },
    },
  ];
  selectedEvents: IGameEvent[] = [];

  ngOnInit() {
    this.generateRandomEvents();
  }

  onSelected(cardIndex: number) {
    this.selectedCardIndex = cardIndex;
    // émettre l'événement sélectionné vers le parent
    const selectedEvent = this.selectedEvents[cardIndex];
    this.eventApplied.emit(selectedEvent);
  }

  private generateRandomEvents() {
    const shuffled = [...this.gameEvents].sort(() => Math.random() - 0.5);
    this.selectedEvents = shuffled.slice(0, 3);
  }

  continueToActions() {
    this.continueToGame.emit();
  }
  // convertir les événements en IBonus pour les cartes
  getDisplayedBonuses(): IBonus[] {
    return this.selectedEvents.map((event) => ({
      title: event.title,
      text: event.text,
    }));
  }
}
