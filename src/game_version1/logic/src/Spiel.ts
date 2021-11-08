import { Brett } from "./Brett";
import { Spieler } from "./Spieler";
import { Karte } from "./Karte";
import Karten from "./Karten/";
import "missing-native-js-functions";
import { MAX_PLAYERS } from "./Constants";
import { KleineStadtWeg } from "./Karten/KleineStadtWeg";

export class Spiel {
	public readonly brett: Brett;
	public spieler: Spieler[] = [];
	public ziehstapel: Karte[] = [];
	public letzterSpieler = 0;

	constructor(playerCount: number = 2) {
		if (playerCount < 2) throw new TypeError("Player count must be 2 or greater");
		if (playerCount > MAX_PLAYERS) throw new TypeError(`Player count must be ${MAX_PLAYERS} or less`);

		for (let i = 0; i < playerCount; i++) {
			this.spieler.push(new Spieler());
		}

		this.ziehstapel = Object.values(Karten)
			.map((karte): Karte[] => {
				let karten = [];
				for (let i = 0; i < karte.count; i++) {
					karten.push(new karte());
				}
				return karten;
			})
			.flat()
			.shuffle();

		this.brett = new Brett(new KleineStadtWeg());
	}

	ziehen(): Karte {
		let karte = this.ziehstapel.pop();
		if (!karte) throw this.stoppen();

		return karte;
	}

	starten() {
		// jeden spieler auffordern, eine karte zu legen
	}

	stoppen() {
		this.brett.allesZusammenzählen();
	}
}
