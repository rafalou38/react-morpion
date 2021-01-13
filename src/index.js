import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import emojiCompact from 'emoji.json/emoji-compact.json'


function choose(choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

function Square(props) {
	return (
		<button
			className={
				"square " + (props.value() ? "" : "empty") + props.className
			}
			onClick={props.onClick}
		>
			{props.value()}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square
				value={this.props.squares[i]}
				onClick={() => {
					this.props.onClick(i);
				}}
				className={
					this.props.winners
						? this.props.winners.indexOf(i) !== -1
							? "winer"
							: ""
						: ""
				}
			/>
		);
	}

	render() {
		return (
			<div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			history: [
				{
					squares: Array(9).fill(null),
				},
			],
			xIsNext: true,
			stepNumber: 0,
		};

		const PlayerX = localStorage.getItem("PlayerX");
		const PlayerO = localStorage.getItem("PlayerO");
		console.log(PlayerX, PlayerO);
		this.state.O = PlayerO ? PlayerO : "O";
		this.state.X = PlayerX ? PlayerX : "X";
	}
	getNext() {
		return this.state.xIsNext ? "X" : "O";
	}
	getPlayer(type) {
		if (type === "X") {
			return this.state.X;
		} else if (type === "O") {
			return this.state.O;
		} else {
			return type;
		}
	}
	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: step % 2 === 0,
		});
	}
	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares).winner || squares[i]) {
			return;
		}
		squares[i] = this.getNext();
		this.setState({
			history: history.concat([
				{
					squares: squares,
				},
			]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}
	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		const moves = history.map((step, move) => {
			let desc = move
				? move + " " + (move % 2 ? this.state.X : this.state.O)
				: "🌱";
			return (
				<li
					id={move === this.state.stepNumber ? "current" : ""}
					key={move}
				>
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});

		let status;
		if (winner.winner) {
			status = this.getPlayer(winner.winner) + " a gagné";
		} else {
			status = "Next player: " + this.getPlayer(this.getNext());
		}

		return (
			<div className="game">
				<h1>Tic-Tac-Toe 🕹️</h1>
				<div className="game-board">
					<Board
						squares={current.squares.map((square) => (_) => {
							return this.getPlayer(square);
						})}
						onClick={(i) => this.handleClick(i)}
						winners={winner.positions}
					/>
				</div>
				<div className="game-info">
					<div id="status">{status}</div>
					<ol>{moves}</ol>
				</div>
				<div className="players">
					<input
						type="text"
						placeholder="X"
						onChange={(text) => {
							this.setState({
								X: text.target.value ? text.target.value : "X",
							});
							localStorage.setItem("PlayerX", text.target.value);
						}}
						maxLength="2"
						value={this.state.X}
						defaultValue={this.state.X}
					/>
					<input
						type="text"
						placeholder="O"
						onChange={(text) => {
							this.setState({
								O: text.target.value ? text.target.value : "O",
							});
							localStorage.setItem("PlayerO", text.target.value);
						}}
						defaultValue={this.state.O}
						value={this.state.O}
						maxLength="2"
					/>
					<div className="shuffle-container">
						<button className="shuffle-btn" onClick={_=>{
							this.setState({
								X: choose(emojiCompact),
								O: choose(emojiCompact)
							})
						}}>🎲</button>
					</div>
				</div>
			</div>
		);
	}
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (
			squares[a] &&
			squares[a] === squares[b] &&
			squares[a] === squares[c]
		) {
			return { winner: squares[a], positions: lines[i] };
		}
	}
	return { winner: null, positions: null };
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
