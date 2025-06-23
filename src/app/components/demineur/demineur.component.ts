import { Component, OnInit, signal, computed, effect } from '@angular/core';

type GameState = 'waiting' | 'playing' | 'gameOver' | 'victory';

@Component({
  selector: 'app-demineur',
  imports: [],
  templateUrl: './demineur.component.html',
  styleUrl: './demineur.component.scss',
})
export class DemineurComponent implements OnInit {
  Array = Array;

  gameState = signal<GameState>('waiting');
  seconds = signal(60);
  message = signal<string | number>('60');
  clickedCases = signal<Set<number>>(new Set());
  mineCase = signal<number>(-1);

  flaggedCases = signal<Set<number>>(new Set());
  flagsRemaining = signal(1);

  isWaiting = computed(() => this.gameState() === 'waiting');
  isPlaying = computed(() => this.gameState() === 'playing');
  isGameOver = computed(() => this.gameState() === 'gameOver');
  isVictory = computed(() => this.gameState() === 'victory');

  private interval = 0;

  ngOnInit(): void {
    this.message.set(this.seconds());
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  private clearTimer() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = 0;
    }
  }

  isCaseClicked(index: number): boolean {
    return this.clickedCases().has(index);
  }

  isMineCase(index: number): boolean {
    return this.mineCase() === index;
  }

  isMineExploded(): boolean {
    return this.isGameOver() && this.clickedCases().has(this.mineCase());
  }

  isCaseFlagged(index: number): boolean {
    return this.flaggedCases().has(index);
  }

  getCaseText(index: number): string {
    if (this.isCaseFlagged(index)) {
      return '🚩';
    }

    if (!this.isCaseClicked(index)) return '';

    if (this.isMineCase(index) && this.isGameOver()) {
      return 'oops';
    }

    return 'No';
  }

  onRightClick(event: MouseEvent, index: number) {
    event.preventDefault();

    if (!this.isPlaying()) return;
    if (this.isCaseClicked(index)) return;

    const newFlaggedCases = new Set(this.flaggedCases());

    if (this.isCaseFlagged(index)) {
      newFlaggedCases.delete(index);
      this.flaggedCases.set(newFlaggedCases);
      this.flagsRemaining.set(1);
    } else {
      if (this.flagsRemaining() > 0) {
        newFlaggedCases.add(index);
        this.flaggedCases.set(newFlaggedCases);
        this.flagsRemaining.set(0);
      }
    }
  }

  clickCase(index: number) {
    if (!this.isPlaying()) return;
    // verifie si case pas déjà cliquée ou case déja avec drapeau
    if (this.isCaseClicked(index)) return;
    if (this.isCaseFlagged(index)) return; 

    const newClickedCases = new Set(this.clickedCases());
    newClickedCases.add(index);
    this.clickedCases.set(newClickedCases);

    if (this.isMineCase(index)) {
      this.triggerGameOver();
      return;
    }

    // Vérifier victoire : toutes les cases sauf la mine cliquées
    if (newClickedCases.size === 80) {
      this.triggerVictory();
    }
  }

  startGame() {
    this.gameState.set('playing');
    this.seconds.set(60);
    this.message.set(60);
    this.clickedCases.set(new Set());
    this.flaggedCases.set(new Set()); 
    this.flagsRemaining.set(1); 

    const randomMine = Math.floor(Math.random() * 81);
    this.mineCase.set(randomMine);

    this.startTimer();
  }

  restart() {
    this.resetGame();
    this.startGame();
  }

  private startTimer() {
    this.clearTimer();
    this.interval = window.setInterval(() => {
      const currentSeconds = this.seconds() - 1;
      this.seconds.set(currentSeconds);
      this.message.set(currentSeconds);

      if (currentSeconds <= 0) {
        this.triggerGameOver();
      }
    }, 1000);
  }

  private triggerGameOver() {
    this.clearTimer();
    this.gameState.set('gameOver');
  }

  private triggerVictory() {
    this.clearTimer();
    this.gameState.set('victory');
  }

  private resetGame() {
    this.clearTimer();
    this.gameState.set('waiting');
    this.seconds.set(60);
    this.message.set(60);
    this.clickedCases.set(new Set());
    this.flaggedCases.set(new Set()); 
    this.flagsRemaining.set(1); 
    this.mineCase.set(-1);
  }
}