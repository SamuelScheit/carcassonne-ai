import { Spiel, Karte } from "carcassonne-logic";
import { Teil } from "carcassonne-logic/dist/Karte";
import { Request, Router } from "express";
import { games } from "../../../data/games";
import { mapMinuxIndexArray } from "../../../Utils";

const router = Router();

router.get("/", (req, res) => {
	res.json(games.map((game, i) => i));
});

function getGame(req: Request): Spiel {
	// @ts-ignore
	const game = <Spiel>games[req.params.id];
	if (!game) throw new Error("Spiel nicht gefunden");
	return game;
}

router.get("/:id", (req, res) => {
	const game = getGame(req);
	const karten = mapMinuxIndexArray(game.brett.karten, (column: Karte[]) =>
		mapMinuxIndexArray(column, (karte: Karte) => {
			if (!karte) return {};
			const wappen = !!Object.values(karte.teile).find((x) => x.wappen);
			const figur = Object.entries(karte.teile).find((x) => x[1].meeple);

			return {
				fläche: karte.id,
				rotation: karte.rotation,
				wappen,
				figur: figur?.[0],
				spieler: figur?.[1].meeple?._id,
			};
		})
	);
	const ziehstapelLänge = game.ziehstapel.length;
	const spieler = game.spieler;

	res.json({
		karten,
		ziehstapelLänge,
		spieler,
		letzteKarte: game.ziehstapel.last()?.id,
		letzterSpieler: game.letzterSpieler,
	});
});

router.post("/:id/legen", (req, res) => {
	if (!req.body) throw "POST request muss einen body enthalten";
	const game = getGame(req);
	const { x, y, rotation, meeple, spieler } = req.body;
	if (typeof x !== "number" || typeof y !== "number" || typeof rotation !== "number") {
		throw "x, y, meeple and rotation must be a number";
	}
	const karte = game.ziehen();
	karte.rotieren(rotation);

	try {
		if (meeple && typeof meeple == "string") {
			// @ts-ignore
			const teil: Teil = karte.teile[meeple];
			teil.meeple?.removeFigur();
			const player = Number(spieler) || 0;
			teil.meeple = game.spieler[player];
			game.letzterSpieler = player;
		}

		game.brett.platzieren(x, y, karte);
	} catch (error) {
		game.ziehstapel[game.ziehstapel.length] = karte; // karte wieder zurücklegen in den stapel
		karte.rotieren(4 - (rotation % 4)); // karte wieder zurück rotieren
		throw error;
	}

	res.json({ success: true });
});

router.post("/", (req, res) => {
	if (!req.body) throw new Error("POST request muss einen body enthalten");
	const playerCount = parseInt(req.body.playerCount);
	if (isNaN(playerCount)) throw new Error("playerCount muss eine valide zahl sein");

	const game = games.push(new Spiel(playerCount)) - 1;
	res.json({ success: true, id: game });
});

export default router;
