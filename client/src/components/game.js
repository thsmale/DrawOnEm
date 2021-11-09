import React from 'react';
import './drawing.css';
import kardashian from './images/kim-kardashian.jpg'; 
import beiber from './images/jbeiber.jpg';
import baskin from './images/carolebaskin.jpg'; 
import bonds from './images/barrybonds.jpg'; 
import jones from './images/jerryjones.jpg'; 


/**
 * These initialize my three canvas layers height and width
 */
const CANVAS_HEIGHT = 400; 
const CANVAS_WIDTH = 400; 

/**@class UpdateStats updates my table and its statistics */
class UpdateStats extends React.Component { 
	/**
	 * Creates an instance of UpdateStats
	 *
	 * @constructor
	 * @author tsmale
	 * @param {props} receives data from parent components
	 */
	constructor(props) { 
		super(props); 
		this.state = { 
			stats: [],
		}
	}

	/**
	 * Gets stats when component is laoded
	 */
	componentDidMount() { 
		this.getStats(); 
	}

	/**
	 * Fetches stats from mysql database 
	 */
	getStats() { 
		fetch('/api/allstats')
			.then(res => res.json())
			.then(stats => this.setState({stats}, 
				() => console.log('All Stats fetched ...', stats)));
	}

	/**
	 * Use map to insert data into table rows 
	 *
	 * @return data to render method in table
	 */
	renderTableData() { 
		return this.state.stats.map(stat => { 
			return ( 
				<tr key = {stat.id}> 
				<td>{stat.name}</td>
				<td>{stat.image_chosen}</td> 
				<td>{stat.write_on}</td> 
				<td>{stat.draw_on}</td> 
				<td>{stat.trifecta}</td> 
				</tr>
			)
		})
	}

	/*
	 * Function is executed everytime the component is updated
	 *
	 * @param {prevProps} Object that contains value of previous props
	 */
	componentDidUpdate(prevProps) { 
		console.log("UpdateStats updated image is : ",this.props.image);  
		console.log("State is: ", this.state.test); 
		if(prevProps !== this.props) { 
			if(this.props.image === null) { 
				return 
			}
			if(prevProps.image !== this.props.image) { 
				this.updateImage(this.props.image); 
			}
			/*
			if(prevProps.text !== this.props.text) { 
				this.updateText(this.props.image); 
			}
		}else { 
			this.updateDrawOn(this.props.image); 
		}
		*/
		}
	}

	/**
	 * Returns the associated id of the data row with the picture
	 *
	 * @param {img} contains the image 
	 * @return {img} is an integer of the id row 
	 */
	getId(img) { 
		switch(img) { 
			case kardashian: 
				img = 1; 
				break;
			case beiber: 
				img = 2; 
				break; 
			case baskin: 
				img = 3; 
				break; 
			case bonds: 
				img = 4; 
				break; 
			case jones: 
				img = 5; 
				break; 
			default: 
				img = null; 
				return; 
		}
		return img; 
	}

	/*
	 * Update the data base that an image was chosen
	 *
	 * @param {img} indicates the id row to update in the database
	 */
	updateImage(img) { 
		console.log(img); 
		let id = this.getId(img); 
		fetch(`http://localhost:5000/api/updateimagechosen/${id}`)
			.then(this.getStats())
			.catch(err => console.log(err))
	}

	/*
	 * Update the data base that an image was drawn on
	 *
	 * @param {img} indicates the id row to update in the database
	 */
	updateDrawOn(img) {
		let id = this.getId(img); 
		fetch(`http://localhost:5000/api/updatedrawnon/${id}`)
			/*.then(this.getStats())*/
			.catch(err => console.log(err))
	}

	/*
	 * Update the data base that text was written over an image
	 *
	 * @param {img} indicates the id row to update in the database
	 */
	updateText(img) { 
		console.log(img); 
		let id = this.getId(img); 
		let stat = this.props.text.length; 
		console.log("Update text", id, stat); 
		fetch(`http://localhost:5000/api/writeon?name=${img}&stat=${stat}`)
			/*.then(this.getStats())*/
			.catch(err => console.log(err))
	}

	/**
	 * Render the return as a div and write it to the dom
	 *
	 * @return {div} will be written to the dom
	 */
	render() { 
		return (
		<div className = "statTable">
			<h2 className = "leaderBoardTitle">Leader Board</h2>
				<table className = "Table">
					<thead> 
						<tr>
							<th>Name</th>
							<th>Image Chosen</th>
							<th>Written on</th>
							<th>Drawn On</th>
							<th>Trifecta</th>
						</tr>
					</thead>
					<tbody>
								{this.renderTableData()}
					</tbody>
				</table>
			</div>
		);
	}
}

/**@class ImageCanvas*/
class ImageCanvas extends React.Component { 
	/**
	 * Creates an instance of Image canvas
	 *
	 * @constructor
	 * @author tsmale
	 * @param {props} receives data from parent components
	 */
	constructor(props) { 
		super(props); 
		this.canvasRefImage = React.createRef(); 
		this.imageRef = React.createRef(); 
	}

	/**
	 * Load the canvas
	 */
	componentDidMount() { 
		//Image canvas
		const c_img = this.canvasRefImage.current; 
		this.ctx_img = c_img.getContext("2d"); 
		const img = this.imageRef.current;
			img.onload = () => {
				this.ctx_img.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); 
		}
	}

	/*
	 * Function is executed everytime the component is updated
	 *
	 * @param {prevProps} Object that contains value of previous props
	 */
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

	/**
	 * Render the return as a div and write it to the dom
	 *
	 * @return {div} will be written to the dom
	 */
	render() { 
		return ( 
				<div className = "myCanvas">
					<canvas className = "layer1" ref={this.canvasRefImage} width={CANVAS_WIDTH} 
									height={CANVAS_HEIGHT} />
        <img ref={this.imageRef} src={this.props.image} alt = "Hidden" className = "hidden"/>
			</div>
		);
	}
}

class TextCanvas extends React.Component { 
	/**
	 * Creates an instance of UpdateStats
	 *
	 * @constructor
	 * @author tsmale
	 * @param {props} receives data from parent components
	 */

	constructor(props) { 
		super(props); 
		this.canvasRefText = React.createRef(); 
	}

	/**
	 * Load the canvas
	 */
	componentDidMount() { 
		//Text canvas
		const c_text = this.canvasRefText.current; 
		this.ctx_text = c_text.getContext("2d"); 
		this.ctx_text.font = "30px Comic Sans MS"; 
		this.ctx_text.fillStyle = "red"; 
	}

	/*
	 * Function is executed everytime the component is updated
	 *
	 * @param {prevProps} Object that contains value of previous props
	 */
	componentDidUpdate(prevProps) { 
		if(prevProps !== this.props) { 
			this.ctx_text.fillStyle = this.props.textObj.color; 
			this.ctx_text.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); 
			/*
			 * ouch I spent 2 days on this code.
			this.ctx_text.clearRect(prevProps.textObj.textX-2, prevProps.textObj.textY-25, 
					this.ctx_text.measureText(prevProps.textObj.text).width+2, 35); 
					*/
			this.ctx_text.fillText(this.props.textObj.text, this.props.textObj.textX, 
														 this.props.textObj.textY); 
		}
	}

	/**
	 * Render the return as a div and write it to the dom
	 *
	 * @return {div} will be written to the dom
	 */
	render() { 
		return ( 
			<div className = "myCanvas"> 
				<canvas className = "layer2" ref={this.canvasRefText} width={CANVAS_HEIGHT} 
								height={CANVAS_HEIGHT} />
			</div>
		); 
	}
}

/**@class DrawCanvas*/
class DrawCanvas extends React.Component { 
	/**
	 * Creates an instance of DrawCanvas
	 *
	 * @constructor
	 * @author tsmale
	 * @param {props} receives data from parent components
	 */
	constructor() { 
		super(); 
		this.state = { 
			canvas_height: 400, 
			canvas_width: 400,
			prevX: 0,
			prevY: 0,
			curX: 0,
			curY: 0,
			draw: false 
		}
		this.canvasRefDraw = React.createRef(); 

		//.bind Func to component to have access to props and state
		this.onMouseDown = this.onMouseDown.bind(this); 
		this.onMouseMove = this.onMouseMove.bind(this); 
		this.endPaintEvent = this.endPaintEvent.bind(this); 
	}

	/*
	 * Keep track of data to paint with
	 */
	isPainting = false;
	line = [];
	prevPos = {offsetX: 0, offsetY:0}; 

	/**
	 * Called everytime the mouse is down
	 *
	 * @param {nativeEvent} is the action of the mouse being pressed down
	 */
	onMouseDown({nativeEvent}) { 
		const {offsetX, offsetY} = nativeEvent; 
		this.isPainting = true; 
		this.prevPos = {offsetX, offsetY}; 
	}

	/**
	 * The mouse is moving 
	 *
	 * @param {nativeEvent} the mouse is moving
	 */
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
		}
	}

	/*
	 * Set the offset 
	 *
	 * @param e is the event of the mouse being pressed down
	 */
	_onMouseMove(e) { 
		this.setState({
			x: e.nativeEvent.offsetX,
			y: e.nativeEvent.offsetY,
			draw: true 
		}); 
	}

	/**
	 * The user is done painting, for now
	 */
	endPaintEvent() { 
		if(this.isPainting) { 
			this.isPainting = false; 
		}
	}

	/**
	 * Paint the mouse movements onto the canvas
	 *
	 * @param {prevPos} previous position of mouse
	 * @param {currPos} current position of mouse 
	 */
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

	/**
	 * Load the canvas
	 */
	componentDidMount() { 
		//Draw Canvas
		const c_draw = this.canvasRefDraw.current; 
		this.ctx_draw = c_draw.getContext("2d"); 
	}

	/*
	 * Function is executed everytime the component is updated
	 *
	 * @param {prevProps} Object that contains value of previous props
	 */
	componentDidUpdate(prevProps) { 
		if(prevProps.clear_draw !== this.props.clear_draw) { 
			this.ctx_draw.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); 
			this.setState ({
				draw: false
			}); 
		}
	}

	/**
	 * Render the return as a div and write it to the dom
	 *
	 * @return {div} will be written to the dom
	 */
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

/**@class ChooseImage*/
class ChooseImage extends React.Component { 
	/**
	 * Creates an instance of ChooseImage 
	 *
	 * @constructor
	 * @author tsmale
	 * @param {props} receives data from parent components
	 */
	constructor(props) { 
		super(props); 
		this.state = {
			image: null
		};
	}

	/*
	 * Set the state of the image 
	 *
	 * @param img is the name of the image to be renderd to canvas
	 */
	setImage(img) { 
		this.setState({
			image: img
		}); 
	}

	/*
	 * Function is executed everytime the component is updated
	 *
	 * @param {prevProps} Object that contains value of previous props
	 */
	componentDidUpdate(prevProps) { 
		if(prevProps.clear_image !== this.props.clear_image) { 
			this.setState({
				image: null
			}); 
		}
	}

	/**
	 * Render the return as a div and write it to the dom
	 *
	 * @return {div} will be written to the dom
	 */
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
				<UpdateStats image = {this.state.image}/>
			</div>
		); 
	}
}

/**@class MoveText*/
class MoveText extends React.Component { 
	/**
	 * Creates an instance of MoveText
	 *
	 * @constructor
	 * @author tsmale
	 * @param {props} receives data from parent components
	 */
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

	/**
	 * Move the x and y axis of the text 
	 *
	 * @param {x} changes the x axis
	 * @param {y} changes the y axis
	 */
	moveText(x, y) { 
		this.setState({
			textX: this.state.textX+x,
			textY: this.state.textY+y,
		});
		this.textObject.textX = this.state.textX+x; 
		this.textObject.textY = this.state.textY+y; 
	}

	/*
	 * Function is executed everytime the component is updated
	 *
	 * @param {prevProps} Object that contains value of previous props
	 */
	componentDidUpdate(prevProps) { 
		if(prevProps !== this.props) { 
			this.textObject.text = this.props.text; 
			this.textObject.color = this.props.color; 
			this.setState({}); 
		}
	}


	/**
	 * Render the return as a div and write it to the dom
	 *
	 * @return {div} will be written to the dom
	 */
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

/**@class EnterText*/
class EnterText extends React.Component { 
	/**
	 * Creates an instance of EnterText
	 *
	 * @constructor
	 * @author tsmale
	 * @param {props} receives data from parent components
	 */
	constructor(props) { 
		super(props); 
		this.state = { 
			text: '' 
		}
		this.handleSubmit = this.handleSubmit.bind(this); 
		this.handleChange = this.handleChange.bind(this); 
	}

	/**
	 * Handles the text being entered in the text field
	 *
	 * @param {event} is the text from the keyboard
	 */
	handleChange(event) { 
		this.setState({
			text: event.target.value
		}); 
	}

	/**
	 * Handles the submit button next to our text field
	 *
	 * @param {event} is the submit being pressed
	 */
	handleSubmit(event) { 
		event.preventDefault(); 
	}

	/*
	 * Function is executed everytime the component is updated
	 *
	 * @param {prevProps} Object that contains value of previous props
	 */
	componentDidUpdate(prevProps) { 
		if(prevProps.clear_text !== this.props.clear_text) { 
			console.log("Enter text Component. clearing text"); 
			this.setState({
				text: ''
			}); 
		}
	}

	/**
	 * Render the return as a div and write it to the dom
	 *
	 * @return {div} will be written to the dom
	 */
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

/**@class ChooseColor*/
class ChooseColor extends React.Component { 
	/**
	 * Creates an instance of ChooseColor
	 *
	 * @constructor
	 * @author tsmale
	 * @param {props} receives data from parent components
	 */
	constructor(props) { 
		super(props); 
		this.state = { 
			color: 'red'
		}
	}

	/**
	 * Set the state of the color 
	 *
	 * @param {color} is a string of the color the player wants
	 */
	handleColors(color) { 
		this.setState({
			color : color 
		});
	}

	/**
	 * Render the return as a div and write it to the dom
	 *
	 * @return {div} will be written to the dom
	 */
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

/**@class Erase*/
class Erase extends React.Component { 
	/**
	 * Creates an instance of Erase
	 *
	 * @constructor
	 * @author tsmale
	 * @param {props} receives data from parent components
	 */
	constructor() { 
		super(); 
		this.state = { 
			clear_image: false, 
			clear: false,
			clear_text: false, 
			clear_draw: false
		}
	}

	/*
	 * This function determines what layer the user wants to clear
	 *
	 * @param {layer} is a string of the layer to delete
	 */
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

	/**
	 * Render the return as a div and write it to the dom
	 *
	 * @return {div} will be written to the dom
	 */
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

export default Erase; 
