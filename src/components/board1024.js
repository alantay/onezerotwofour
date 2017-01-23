import React from 'react'

function Tile(props){
    return(
        <div className="tile">
            <div>{props.num}</div>
        </div>
    )
}

class Board1024 extends React.Component{
    constructor(props){
        super(props)
        
        this.state = {
            boardState: this.createEmptyBoard()
        }
        
        console.log(this.state.boardState)
    }

    createEmptyBoard(){
        const tArr = [];        
        for(let row = 0;row < 4; row++){
            tArr.push([])
            for(let col = 0; col < 4; col++){
                tArr[row].push(null);
            }
        }
        return tArr;
    }

    render(){
        return(
            <div className="board" >
                <div className="grid-slot"></div>
                <div className="grid-slot"></div>
                <div className="grid-slot"></div>
                <div className="grid-slot"></div>
                <div className="grid-slot"></div>
                <div className="grid-slot"></div>
                <div className="grid-slot"></div>
                <div className="grid-slot"></div>
                <div className="grid-slot"></div>
                <div className="grid-slot"></div>
                <div className="grid-slot"></div>
                <div className="grid-slot"></div>
                <div className="grid-slot"></div>
                <div className="grid-slot"></div>
                <div className="grid-slot"></div>
                <div className="grid-slot"></div>
            </div>
        )
    }

}

export default Board1024