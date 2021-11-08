export class Spieler {
	private _punkte: number = 0;
	public readonly _id: string;
	private static _idCounter = 0;
	private _figuren: number = 7;

	constructor({ id }: { id?: string } = {}) {
		this._id = id ? id : "" + Spieler._idCounter++;
	}

	get figuren() {
		return this._figuren;
	}

	get punkte() {
		return this._punkte;
	}

	addPunkte(score: number) {
		this._punkte += score;
	}

	removeFigur() {
		if (this._figuren <= 0) throw new Error("Es sind bereits alle Meeples auf dem Spielfeld gesetzt");
		this._figuren--;
	}

	addFigur() {
		this._figuren++;
	}

	async zug() {}
}
