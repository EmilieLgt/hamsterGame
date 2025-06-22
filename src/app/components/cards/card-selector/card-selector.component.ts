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
    {
      title: 'Bonus',
      text: 'Hausse de salaire +30fr, merci patron !',
      effect: { type: 'money', value: 30 },
    },
    {
      title: 'Bonus',
      text: 'Don de nourriture de la ligue de protection des hamsters, +10kg !',
      effect: { type: 'food', value: 10 },
    },
    {
      title: 'Bonus',
      text: 'Saison des amours ! Reproduction assurée !',
      effect: { type: 'hamster_birth', value: 2 },
    },
    {
      title: 'Malus',
      text: 'Épidémie de COVID-32 : 2 hamsters morts',
      effect: { type: 'hamster_death', value: 2, target: 'all' },
    },
    {
      title: 'Malus',
      text: 'Inflation ! Tous les prix augmentent de 50% !',
      effect: { type: 'price_modifier', value: 1.5, target: 'all' },
    },
    {
      title: 'Malus',
      text: 'Pénurie alimentaire, plus de croquette au Liddl, -5kg',
      effect: { type: 'food', value: -5 },
    },
    {
      title: 'Bonus',
      text: 'Promo chez Jardiland, hamsters à -50%',
      effect: { type: 'price_modifier', value: 0.5, target: 'hamster' },
    },
    {
      title: 'Malus',
      text: 'Taxe sur les propriétaires de cages ! -15€',
      effect: { type: 'money', value: -15 },
    },
    {
      title: 'Bonus',
      text: 'Cage gratuite, offerte pour toute visite chez Carrefour',
      effect: { type: 'money', value: 20 },
    },
    {
      title: 'Malus',
      text: 'Burn out chez les femelles, moins de reproduction',
      effect: { type: 'hamster_birth', value: -1 },
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
