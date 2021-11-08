import { Constants } from "carcassonne-logic/dist";
import React, { Component } from "react";

export class Karte extends Component {
	constructor(props) {
		super(props);
		this.state = {
			rotation: this.props.rotation || 0,
		};
	}

	// componentWillReceiveProps() {
	// 	this.setState({ ...this.state, rotation: this.props.rotation || 0 });
	// }

	rotate = () => {
		console.log("click", this.state);
		if (!this.props.canRotate) return;

		this.setState({ ...this.state, rotation: (this.state.rotation + 1) % 4 });
	};

	render() {
		const { id, className, canRotate, wappen, figur } = this.props;
		const kartenName = Constants.KARTEN[id];
		const pfad = `/res/OriginalKarten/${kartenName}${wappen ? "Wappen" : ""}.png`;

		return (
			<div
				onClick={this.rotate}
				key={id}
				className={"karte " + (canRotate ? "canRotate " : "") + (className || "")}
			>
				{kartenName && (
					<img
						style={{ transform: `rotate(${this.state.rotation * 90}deg)` }}
						src={pfad}
						alt={kartenName}
					></img>
				)}
				{figur && (
					<div
						className="figur"
						style={{
							top: `${figur?.y * (5 / 3)}rem`,
							left: `${figur?.x * (5 / 3)}rem`,
							backgroundColor: this.props.color,
						}}
					></div>
				)}
			</div>
		);
	}
}
