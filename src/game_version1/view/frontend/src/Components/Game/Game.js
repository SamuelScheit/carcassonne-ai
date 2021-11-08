import { Component, createRef, Fragment } from "react";
import { request } from "../../Util/request";
import "./Game.scss";
import { Karte } from "../Karte/Karte";
import "missing-native-js-functions";

export class Game extends Component {
	constructor(props) {
		super(props);
		this.state = {
			karten: [[]],
			spieler: [],
			ziehstapelLänge: 0,
			loaded: false,
			letzteKarte: null,
			letzterSpieler: null,
			error: null,
			figur: null,
		};
		this.farben = new Map();
		this.vorschau = createRef();
	}

	refresh = async () => {
		const game = await request(`/games/${this.props.id}/`);
		this.setState({ ...game, loaded: true });
	};

	componentWillReceiveProps() {
		this.refresh();
	}

	componentDidMount() {
		this.refresh().then(() => {
			this.state.spieler.forEach((x) => {
				this.farben.set(x._id, "#" + Math.floor(Math.random() * 16777215).toString(16));
			});
		});
	}

	hierPlatzieren = async (event) => {
		console.log(event);
		const { target } = event;
		const x = parseInt(target.getAttribute("data-x"));
		const y = parseInt(target.getAttribute("data-y"));
		const { rotation } = this.vorschau.current.state;
		let meeple = null;

		if (this.state.figur) {
			meeple = coordinatesToName(this.state.figur.x, this.state.figur.y);
		}

		const res = await request(`/games/${this.props.id}/legen`, {
			body: { x, y, rotation, meeple, spieler: this.momentanerSpieler },
		}).catch((e) => this.setState({ error: e.error }));
		this.setState({
			figur: null,
		});
		await this.refresh();
	};

	figurSetzen = (event) => {
		const { target } = event;
		const { figur } = this.state;

		const x = parseInt(target.getAttribute("data-x"));
		const y = parseInt(target.getAttribute("data-y"));
		console.log(this.state.figur, x, y);

		if (figur && figur.x === x && figur.y === y) {
			this.setState({ ...this.state, figur: null });
		} else {
			this.setState({ ...this.state, figur: { x, y } });
		}
	};

	get momentanerSpieler() {
		if (!this.state.spieler || this.state.letzterSpieler == null) return;
		return this.state.spieler[(this.state.letzterSpieler + 1) % this.state.spieler.length]._id;
	}

	render() {
		return (
			<div className="spiel">
				<h1>Spiel {this.props.id}</h1>
				<div className="split">
					<div className="control">
						<button className="primary button refresh" onClick={this.refresh}>
							Refresh
						</button>
						<br></br>
						Ziehstapel:
						<br></br>
						<Karte
							ref={this.vorschau}
							canRotate={true}
							className="vorschau"
							id={this.state.letzteKarte}
							figur={this.state.figur}
							color={this.farben?.get(this.momentanerSpieler)}
						></Karte>
						<div className="figurSetzen">
							{(() => {
								let elements = [];
								for (let y = 0; y < 3; y++) {
									let row = [];
									for (let x = 0; x < 3; x++) {
										row.push(
											<div
												id={x}
												data-y={x}
												data-x={y}
												onClick={this.figurSetzen}
												className="entry"
											></div>
										);
									}
									elements.push(
										<div id={y} className="row">
											{row}
										</div>
									);
								}
								return elements;
							})()}
						</div>
						<div className="error">{this.state.error}</div>
					</div>
					<div className="spielerliste">
						{this.state.spieler.map((spieler) => {
							return (
								<div key={spieler._id} style={{ color: this.farben.get(spieler._id) }}>
									{spieler._id}. Spieler Punkte: {spieler._punkte}{" "}
									{spieler._id == this.momentanerSpieler && "(Am Zug)"}
								</div>
							);
						})}
					</div>
				</div>
				<br></br>
				<hr></hr>
				<br></br>
				<div className="gitter">
					{this.state.loaded &&
						mapMinuxIndexArray(this.state.karten, (spalte, y) => {
							return (
								<div key={y} className="reihe">
									{mapMinuxIndexArray(spalte, (eintrag, x) => {
										if (!eintrag || !eintrag.fläche)
											return (
												<div
													onClick={this.hierPlatzieren}
													data-x={x}
													data-y={y}
													className="karte"
												></div>
											);
										return (
											<Fragment>
												<Karte
													wappen={eintrag.wappen}
													id={eintrag.fläche}
													rotation={eintrag.rotation}
													figur={nameToCoordinates(eintrag.figur)}
													color={this.farben.get(eintrag.spieler)}
												></Karte>
											</Fragment>
										);
									})}
								</div>
							);
						})}
				</div>
			</div>
		);
	}
}

function mapMinuxIndexArray(arr, map) {
	return Object.keys(arr)
		.map((x) => parseInt(x))
		.sort((a, b) => a - b)
		.map((x) => map(arr[x], x));
}

// converts x and y to grid property name
function coordinatesToName(x, y) {
	const width = x === 0 ? "links" : x === 1 ? "mitte" : "rechts";
	const height = y === 0 ? "oben" : y === 1 ? "mitte" : "unten";
	if (y === 1) return width + height.capitalize();
	return height + width.capitalize();
}

function nameToCoordinates(name) {
	if (!name) return;
	const partSlice = name.split(/[A-Z]/)[0].length;
	const height = name.slice(0, partSlice);
	const width = name.slice(partSlice);

	return {
		x: width === "Links" ? 0 : width === "Mitte" ? 1 : 2,
		y: height === "oben" ? 0 : height === "mitte" ? 1 : 2,
	};
}
