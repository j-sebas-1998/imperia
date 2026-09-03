import { Component, signal } from '@angular/core';

@Component({
selector: 'app-root',
imports: [],
templateUrl: './app.html',
styleUrl: './app.scss'
})
export class App {
	protected readonly menuOpen = signal(false);

	protected toggleMenu(): void { this.menuOpen.update((open) => !open); }
	protected closeMenu(): void { this.menuOpen.set(false); }
}
