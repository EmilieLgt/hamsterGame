export interface IBonus {
  title: BonusType;
  text: string;
}

export type BonusType = 'Bonus' | 'Malus';

export interface IGameEvent {
  title: BonusType;
  text: string;
  effect: {
    type:
      | 'money_percentage'
      | 'food_percentage'
      | 'hamster_death_percentage'
      | 'hamster_birth_boost'
      | 'price_modifier';
    value: number;
    target?: string;
  };
}
