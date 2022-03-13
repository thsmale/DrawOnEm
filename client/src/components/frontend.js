import React from 'react';
import './drawing.css';
import kardashian from './images/kim-kardashian.jpg'; 
import beiber from './images/jbeiber.jpg';
import baskin from './images/carolebaskin.jpg'; 
import bonds from './images/barrybonds.jpg'; 
import jones from './images/jerryjones.jpg'; 
import beeteroot from './images/beeteroot.jpg'; 


const CANVAS_HEIGHT = 400; 
const CANVAS_WIDTH = 400; 

class ImageCanvas extends React.Component { 
	constructor(props) { 
		super(props); 
		this.canvasRefImage = React.createRef(); 
		this.imageRef = React.createRef(); 
	}

	componentDidMount() { 
		//Image canvas
		const c_img = this.canvasRefImage.current; 
		this.ctx_img = c_img.getContext("2d"); 
		const img = this.imageRef.current;
			img.onload = () => {
				this.ctx_img.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); 
		}
	}

	componentDidUpdate(prevProps) { 
		if(prevProps !== this.props) { 
			if(this.props.image === null) { 
				this.ctx_img.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); 
				return; 
			}
			const img = this.imageRef.current;
			img.onload = () => {
				this.ctx_img.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); 
			}
		}
	}

	render() { 
		return ( 
				<div className = "myCanvas">
					<canvas className = "layer1" ref={this.canvasRefImage} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
        <img ref={this.imageRef} src={this.props.image} alt = "Hidden" className = "hidden"/>
			</div>
		);
	}
}

class TextCanvas extends React.Component { 
	constructor(props) { 
		super(props); 
		this.canvasRefText = React.createRef(); 
	}
	
	componentDidMount() { 
		//Text canvas
		const c_text = this.canvasRefText.current; 
		this.ctx_text = c_text.getContext("2d"); 
		this.ctx_text.font = "30px Comic Sans MS"; 
		this.ctx_text.fillStyle = "red"; 
	}

	componentDidUpdate(prevProps) { 
		if(prevProps !== this.props) { 
			this.ctx_text.fillStyle = this.props.textObj.color; 
			this.ctx_text.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); 
			/*
			 * ouch I spent 2 days on this code.
			this.ctx_text.clearRect(prevProps.textObj.textX-2, prevProps.textObj.textY-25, 
					this.ctx_text.measureText(prevProps.textObj.text).width+2, 35); 
					*/
			this.ctx_text.fillText(this.props.textObj.text, this.props.textObj.textX, this.props.textObj.textY); 
		}
	}

	render() { 
		return ( 
			<div className = "myCanvas"> 
				<canvas className = "layer2" ref={this.canvasRefText} width={CANVAS_HEIGHT} height={CANVAS_HEIGHT} />
			</div>
		); 
	}
}

class DrawCanvas extends React.Component { 
	constructor() { 
		super(); 
		this.state = { 
			canvas_height: 400, 
			canvas_width: 400,
			prevX: 0,
			prevY: 0,
			curX: 0,
			curY: 0,
		}
		this.canvasRefDraw = React.createRef(); 

		//.bind Func to component to have access to props and state
		this.onMouseDown = this.onMouseDown.bind(this); 
		this.onMouseMove = this.onMouseMove.bind(this); 
		this.endPaintEvent = this.endPaintEvent.bind(this); 
	}

	isPainting = false;
	line = [];
	prevPos = {offsetX: 0, offsetY:0}; 

	onMouseDown({nativeEvent}) { 
		const {offsetX, offsetY} = nativeEvent; 
		this.isPainting = true; 
		this.prevPos = {offsetX, offsetY}; 
	}

	onMouseMove({nativeEvent}) { 
		if(this.isPainting) { 
			const{offsetX, offsetY} = nativeEvent; 
			const offSetData = {offsetX, offsetY}; 
			//Set the start and stop position of the paint event
			const positionData = { 
				start: {...this.prevPos},
				stop: {...offSetData},
			};
			//Add the position to the line array 
			this.line = this.line.concat(positionData); 
			this.paint(this.prevPos, offSetData); 
			console.log(offSetData)
		}
	}

	_onMouseMove(e) { 
		this.setState({
			x: e.nativeEvent.offsetX,
			y: e.nativeEvent.offsetY
		}); 
	}

	endPaintEvent() { 
		if(this.isPainting) { 
			this.isPainting = false; 
		}
	}

	paint(prevPos, currPos) { 
		const {offsetX, offsetY} = currPos; 
		const {offsetX: x, offsetY: y} = prevPos; 

		this.ctx_draw.beginPath(); 
		this.ctx_draw.strokeStyle = this.props.color; 
		//Move the prevPosition of the mouse
		this.ctx_draw.moveTo(x, y); 
		//Draw a line to current position of mouse
		this.ctx_draw.lineTo(offsetX, offsetY); 
		//Visualize the line using the strokeStyle
		this.ctx_draw.stroke(); 
		this.prevPos = {offsetX, offsetY}; 
	}

	componentDidMount() { 
		//Draw Canvas
		const c_draw = this.canvasRefDraw.current; 
		this.ctx_draw = c_draw.getContext("2d"); 
	}

	componentDidUpdate(prevProps) { 
		if(prevProps.clear_draw !== this.props.clear_draw) { 
			this.ctx_draw.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); 
		}
	}

	render() { 
		return ( 
			<div className = "myCanvas">
				<canvas className="layer3" ref={this.canvasRefDraw} onMouseDown = {this.onMouseDown}
					onMouseMove={this.onMouseMove} onMouseUp={this.endPaintEvent}
					width={this.state.canvas_height} height={this.state.canvas_width} />
			</div>
		);
	}
}

class ChooseImage extends React.Component { 
	constructor(props) { 
		super(props); 
		this.state = {
			image: null
		};
	}

	setImage(img) { 
		this.setState({
			image: img
		}); 
	}

	componentDidUpdate(prevProps) { 
		if(prevProps.clear_image !== this.props.clear_image) { 
			this.setState({
				image: null
			}); 
		}
	}

	render() { 
		return (
			<div>
				<div className ="images">
					<img src={kardashian} className = "person" alt="Kim Kardashian" 
							onClick={()=> this.setImage(kardashian)}/>
					<img src={beiber} className = "person" alt="Justin Beiber" onClick={()=> this.setImage(beiber)}/>
					<img src={baskin} className = "person" alt="Carole Baskin" onClick={()=> this.setImage(baskin)}/>
					<img src={bonds} className = "person" alt="Barry Bonds" onClick={()=> this.setImage(bonds)}/>
					<img src={jones} className = "person" alt="Jerry Jones" onClick={()=> this.setImage(jones)}/>
				</div>
				<ImageCanvas image = {this.state.image} />
			</div>
		); 
	}
}

class MoveText extends React.Component { 
	constructor(props) { 
		super(props); 
		this.state = { 
			textX : 0,
			textY : 30, 
		}
		this.textObject = { 
			textX:this.state.textX, 
			textY:this.state.textY,
			text:'',
			color: 'red'
		}; 
	}

	moveText(x, y) { 
		this.setState({
			textX: this.state.textX+x,
			textY: this.state.textY+y,
		});
		this.textObject.textX = this.state.textX+x; 
		this.textObject.textY = this.state.textY+y; 
	}

	componentDidUpdate(prevProps) { 
		if(prevProps !== this.props) { 
			this.textObject.text = this.props.text; 
			this.textObject.color = this.props.color; 
			this.setState({}); 
		}
	}


	render() { 
		return ( 
			<div>
				<div className = "moveText">
					<button className = "arrow right" onClick={() => this.moveText(5, 0)}>&rarr;</button>
					<button className = "arrow left" onClick={() => this.moveText(-5, 0)}>&larr;</button>
					<button className = "arrow down" onClick={() => this.moveText(0, 5)}>&darr;</button>
					<button className = "arrow up" onClick={() => this.moveText(0, -5)}>&uarr;</button>
				</div>
				<TextCanvas textObj = {this.textObject} />
			</div>
		);
	}
}

class EnterText extends React.Component { 
	constructor(props) { 
		super(props); 
		this.state = { 
			text: '' 
		}
		this.handleSubmit = this.handleSubmit.bind(this); 
		this.handleChange = this.handleChange.bind(this); 
	}

	handleChange(event) { 
		this.setState({
			text: event.target.value
		}); 
	}

	handleSubmit(event) { 
		event.preventDefault(); 
	}

	componentDidUpdate(prevProps) { 
		if(prevProps.clear_text !== this.props.clear_text) { 
			console.log("Enter text Component. clearing text"); 
			this.setState({
				text: ''
			}); 
		}
	}

	render() { 
		return ( 
			<div>
				<div className ="enterText">
					<div>
						<form onSubmit = {this.handleSubmit} >
							<label>Write text on em!
							<input type = "text" className="textInput" value = {this.state.text} 
								onChange = {this.handleChange} />
							</label>
							<input type="submit" value ="Submit" className="submitButton"/>
						</form>
					</div>
				</div>
			<MoveText text = {this.state.text} color = {this.props.color}/>
			</div>
		); 
	}
}

class ChooseColor extends React.Component { 
	constructor(props) { 
		super(props); 
		this.state = { 
			color: 'red'
		}
	}

	handleColors(color) { 
		this.setState({
			color : color 
		});
	}

	render() { 
		return ( 
			<div>
				<div className = "positionButtons">
					<p>Select color for text or drawing</p>
					<div>
						<button className = "button green" onClick={() => this.handleColors('green')}>
							Green</button>
						<button className = "button yellow" onClick={() => this.handleColors('yellow')}>
							Yellow</button>
					</div>
					<div>
						<button className = "button red" onClick={() => this.handleColors('red')}>
							Red</button>
						<button className = "button blue" onClick={() => this.handleColors('blue')}>
							Blue</button>
					</div>
					<div>
						<button className = "button orange" onClick={() => this.handleColors('orange')}>
							Orange</button>
						<button className = "button purple" onClick={() => this.handleColors('purple')}>
							Purple</button>
					</div>
					<div>
						<button className = "button grey" onClick={() => this.handleColors('grey')}>
							Grey</button>
						<button className = "button black" onClick={() => this.handleColors('black')}>
							Black</button>
					</div>
				</div>
				<EnterText color = {this.state.color} clear_text = {this.props.clear_text}/>
				<DrawCanvas color = {this.state.color} clear_draw = {this.props.clear_draw}/>
			</div>
		); 
	}
}



class Erase extends React.Component { 
	constructor() { 
		super(); 
		this.state = { 
			clear_image: false, 
			clear: false,
			clear_text: false, 
			clear_draw: false
		}
	}

	handleClear(layer) { 
		if(layer === 'image') { 
			this.setState({
				clear_image: !this.state.clear_image
			}); 
		}else if(layer === 'text') { 
			this.setState({
				clear: !this.state.clear,
				clear_text: !this.state.clear_text
			}); 
		}else if(layer === 'draw') { 
			this.setState({
				clear: !this.state.clear,
				clear_draw : !this.state.clear_draw
			}); 
		}
	}

	render() { 
		return (
			<div>
				<div className = "clearButtons">
					<button className = "clearImage" onClick={() => this.handleClear('image')}>Clear Image</button>
					<button className = "clearText" onClick={() => this.handleClear('text')}>Clear Text</button>
					<button className = "clearDraw" onClick={() => this.handleClear('draw')}>Clear Drawing</button>
				</div>
				<ChooseImage clear_image = {this.state.clear_image}/>
				<ChooseColor clear_text = {this.state.clear_text} clear_draw = {this.state.clear_draw}/>
			</div>
		); 
	}
}

class App extends React.Component { 
	constructor(props) { 
		super(props); 
	}

	render() { 
		return ( 
			<div >
				<Erase />
			</div>
		); 
	}
}


export default App; 
