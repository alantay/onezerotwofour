import React from 'react'

function Tile(props){
    return(
        <div>2</div>
    )
}

class Board1024 extends React.Component{
    constructor(props){
        super(props)
        
        this.state = {
            
        }
        this.init();
    }

    init(){
        const totalTiles = 16
        const rowTiles = 4;
        const colTiles = 4;
        const boardWidth = 500;
        const gutter = 5;
        let tileWidth;
        let positionArray = new Array(4);


        tileWidth = boardWidth/rowTiles;
         console.log(rowTiles);
        for(let r = 0; r < rowTiles; r++){
            
           for(let c = 0; c < colTiles; c++){
                if(!positionArray[r]) positionArray[r] = new Array(4)
                positionArray[r][c]= {x: gutter + c * tileWidth, y: gutter + r * tileWidth}
           } 
        }
        console.log(positionArray)
    }

    generateTile(){
       
       return <Tile>2</Tile>
    }
    
    

    render(){
        return(
            <div className="board">
                {this.generateTile()}
            </div>
        )
    }

}

export default Board1024