import React from 'react';
import './drawing.css';
import kardashian from './kim-kardashian.jpg'; 
import beiber from './jbeiber.jpg'; 
import baskin from './carolebaskin.jpg'; 
import bonds from './barrybonds.jpg'; 
import jones from './jerryjones.jpg'; 
import beeteroot from './beeteroot.jpg'; 


const CANVAS_HEIGHT = 400; 
const CANVAS_WIDTH = 400; 

class Drawing extends React.Component { 
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

	clearCanvas() { 
		if(this.props.clear_canvas === 'image') { 
			this.ctx_img.clearRect(0, 0, this.state.canvas_width, this.state.canvas_height); 
		}else if(this.props.clear_canvas === 'text') { 
			this.ctx_text.clearRect(0, 0, this.state.canvas_width, this.state.canvas_height); 
			console.log("Clear the text iditio"); 
		}else if(this.props.clear_canvas === 'drawing') { 
			this.ctx_draw.clearRect(0, 0, this.state.canvas_width, this.state.canvas_height); 
		}
	}

		componentDidUpdate(prevProps) { 
		
		if(prevProps !== this.props) { 
					}

		if(prevProps.clear_canvas !== this.props.clear_canvas) { 
			this.clearCanvas();
		}

	}

	render() { 
		return ( 
			<div className = "positionCanvas">
				<canvas className="myCanvas canvas2" ref={this.canvasRefDraw} onMouseDown = {this.onMouseDown}
					onMouseMove={this.onMouseMove} onMouseUp={this.endPaintEvent}
					width={this.state.canvas_height} height={this.state.canvas_width} />
			</div>
		);
	}
}


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
	render() { 
		return ( 
			<div className = "positionCanvas">
				<canvas className="myCanvas canvas0" ref={this.canvasRefImage} width={CANVAS_WIDTH} 
					height={CANVAS_HEIGHT} />
        <img ref={this.imageRef} src={this.props.image} alt = "Hidden image" className = "hidden"/>
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
	}

	componentDidUpdate(prevProps) { 
		if(prevProps !== this.props) { 
			this.ctx_text.clearRect(prevProps.textX-1, prevProps.textY-25, 
					this.ctx_text.measureText(prevProps.text).width+1, 35); 
			this.ctx_text.fillText(this.props.text, this.props.textX, this.props.textY); 
		}
	}

	render() { 
		return ( 
			<div className = "positionCanvas"> 
				<canvas className="myCanvas canvas1" ref={this.canvasRefText} width={CANVAS_HEIGHT} 
					height={CANVAS_HEIGHT} />
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

				/*<TextCanvas text = {this.state.text} textX = {this.state.textX} textY = {this.state.textY} />*/
	render() { 
		return ( 
			<div>
				<div className = "positionForm">
					<form onSubmit = {this.handleSubmit} >
						<label>Text
						<input type = "text" className="textInput" value = {this.state.text} 
							onChange = {this.handleChange} />
						</label>
						<input type="submit" value ="Submit" className="submitButton"/>
					</form>
				</div>
				<TextCanvas text = {this.state.text}  />
			</div>
		); 
	}
}

/*
 * This component is used for collecting information from the player like 
 * colors to draw and what image to select
 */
class Player extends React.Component { 
	constructor(props) { 
		super(props); 
		this.state = { 
			color : 'red',
			text : '',
			textX : 0,
			textY : 30, 
			clear_canvas : null,
			image : null,
		};

	}

	handleColors(color) { 
		this.setState({
			color : color 
		});
	}

	

	moveText(x, y) { 
		if(this.state.text === '') return 
		this.setState({
			textX: this.state.textX+x,
			textY: this.state.textY+y,
		});
	}

	handleClear(type) { 
		this.setState({
			clear_canvas: type 
		});
	}

	selectImage(img) { 
		this.setState({
			image: img
		}); 
	}

	render() { 
		return (
			<div>
				<div className ="images">
					<img src={kardashian} className = "person" alt="Kim Kardashian" 
							onClick={()=> this.selectImage(kardashian)}/>
					<img src={beiber} className = "person" alt="Justin Beiber" onClick={()=> this.selectImage(beiber)}/>
					<img src={baskin} className = "person" alt="Carole Baskin" onClick={()=> this.selectImage(baskin)}/>
					<img src={bonds} className = "person" alt="Barry Bonds" onClick={()=> this.selectImage(bonds)}/>
					<img src={jones} className = "person" alt="Jerry Jones" onClick={()=> this.selectImage(jones)}/>
					<img src={beeteroot} className = "person" alt="Beeteroot" onClick={()=> this.selectImage(beeteroot)}/>
				</div>

				<div className = "positionButtons">
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

				<div className = "positionCanvas">
					<Drawing color = {this.state.color}  clear_canvas = {this.state.clear_canvas} />
					<ImageCanvas image = {this.state.image}/>
					<EnterText />
				</div>

				<div className="moveText">
						<button className = "right" onClick={() => this.moveText(5, 0)}>&rarr;</button>
						<button className = "left" onClick={() => this.moveText(-5, 0)}>&larr;</button>
						<button className = "up" onClick={() => this.moveText(0, -5)}>&uarr;</button>
						<button className = "down" onClick={() => this.moveText(0, 5)}>&darr;</button>
				</div>
				<button className = "clearCanvas" onClick={() => this.handleClear('image')}>Clear Image</button>
				<button className = "clearCanvas" onClick={() => this.handleClear('text')}>Clear Text</button>
				<button className = "clearCanvas" onClick={() => this.handleClear('drawing')}>Clear Drawing</button>



			</div>
		);
	}
}

export default Player; 
