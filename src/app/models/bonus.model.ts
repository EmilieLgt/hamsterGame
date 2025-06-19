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
      | 'money'
      | 'food'
      | 'hamster_death'
      | 'hamster_birth'
      | 'price_modifier';
    value: number;
    target?: 'male' | 'female' | 'all' | 'hamster' | 'cage' | 'food';
  };
}
