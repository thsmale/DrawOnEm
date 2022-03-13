import React from 'react' 
import Drawing from './components/game';
import './header.css'; 

class App extends React.Component {
  render() {
    return (
			<div >
				<h1 className = "header">Draw on em!</h1>
				<Drawing />
      </div>
    );
  }
}

export default App;
