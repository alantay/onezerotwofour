import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // TODO: delete this if not using
let _ = require('lodash');
let key = 0
let numOfRow = 4
let numOfCol= 4
const KEYCODE ={
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39

}

function Tile(props){
    return(
        <div className={"tile " +props.className+" color-"+props.data.value} data-ukey={props.ukey}>
            <div>{props.data.value}</div>
        </div>
        )
}

function Board(props){
    let boardState = props.boardState;
    let tiles = [];
    let grids = [];
    
    //styling the tile base on info from boardstate
    _.times(boardState.length,(col)=>{
     _.times(boardState[col].length,(row)=>{

        if(boardState[col][row].value){
            let data = boardState[col][row]
            let key = data.key
            tiles.push(
                <Tile 
                    data={data} 
                    row={row} 
                    col={col} 
                    key={key} 
                    ukey= {key} 
                    className={"pos-" + (col+1) + "-" + (row+1)}>
                </Tile>
            )
        }
    })
})

    _.times(16,(i)=>{
        grids.push(<div className="grid-slot" key={i}></div>)
    })

    return(
        <div className="board">
        {grids}
        {tiles}
        </div>
        )
}

class Board1024 extends React.Component{
    constructor(props){
        super(props)
        
        this.state = {
            boardState: (()=>{

                // Creates a Empty board(pretty much a empty 2d Array)
                const tArr = [];        
                _.times(numOfRow,(c)=>{
                    tArr.push([])
                    _.times(numOfCol,()=>{
                        tArr[c].push({value: null});
                    })
                })
                
                //create a tree of out of each grid
                _.each(tArr, (cv,ck)=>{
                    _.each(tArr[ck], (rv,rk)=>{

                        // if col number is more than one, left will refer to previous col 
                        if(ck>0){
                            tArr[ck][rk].left = tArr[ck-1][rk]     

                        }
                        

                        if(ck<3){
                            tArr[ck][rk].right = tArr[ck+1][rk]     
                        }

                        if(rk>0){
                            tArr[ck][rk].up = tArr[ck][rk-1]     
                        }

                        if(rk<3){
                            tArr[ck][rk].down = tArr[ck][rk+1]     
                        }
                        
                    })
                })
                return tArr;
            })()
        }
    }
    

    // adds a random tile to the board
    addRandomTile(){
        
        let boardState = this.state.boardState
        let unoccupiedGrid = []
        key++
        // log all unoccupied grid into unoccupiedGrid
        _.times(boardState.length,(col)=>{
            _.times(boardState[col].length,(row)=>{
                if(!boardState[col][row].value){
                    unoccupiedGrid.push(col+" "+row)
                }
            })
        })
        
        // select random tile
        let gridToPopulate = _.sample(unoccupiedGrid).split(" ") 
        let c = gridToPopulate[0]
        let r = gridToPopulate[1]
        boardState[c][r].value = 2 
        boardState[c][r].key = key
        
        this.setState({
            boardState: boardState
        });
    }

    moveTiles(direction){
        let boardState = this.state.boardState
        let anyTileMoved = false
        let func = (cv,ck, rv, rk)=>{
            if(boardState[ck][rk].value){
                let head = boardState[ck][rk]
                // current is the iterated node
                let current = head
                let move = false
                let valueUp = false

                // iterating through linked list
                while(
                // while the current node has a node above
                current[direction] &&
                // and while that node above has the same value as the current node
                // or that node is empty
                (current[direction].value == head.value || current[direction].value == null)
                ){
                    // the value of tile increase when 2 tile is the same number
                    if(current[direction].value == head.value && current[direction].value){
                        valueUp = true
                    }
                    // move the current node up
                    current = current[direction]
                    move = true
                }

                if(move){
                    current.value = valueUp? head.value * 2 : head.value 
                    current.key = head.key
                    head.value = null
                    head.key = null
                    anyTileMoved = true
                }
                
            }
        }
        
        
        if(direction == 'up' || direction == 'left'){
            _.each(boardState,(cv, ck)=>{
                _.each(boardState[ck], (rv,rk)=>{
                    func(cv,ck,rv,rk)
                })
            })
        }
        if(direction == 'down'){
            _.each(boardState,(cv, ck)=>{
                _.eachRight(boardState[ck], (rv,rk)=>{
                    func(cv,ck,rv,rk)
                })
            })
        }  
        if(direction == 'right'){
            _.eachRight(boardState,(cv, ck)=>{
                _.each(boardState[ck], (rv,rk)=>{
                    func(cv,ck,rv,rk)
                })
            })
        } 
        if(!anyTileMoved) return
        this.addRandomTile();
        this.setState({
            boardState: boardState
        });
    }
    
    handleKeyDown(evt){
        
        switch(evt.keyCode){
            case KEYCODE.UP:
            this.moveTiles('up')
            
            break;

            case KEYCODE.DOWN:
            this.moveTiles('down')
            break;

            case KEYCODE.LEFT:
            this.moveTiles('left')
            break;

            case KEYCODE.RIGHT:
            this.moveTiles('right')
            break;
        }
    }

    componentWillMount(){
        document.addEventListener("keydown", this.handleKeyDown.bind(this), false);
        this.addRandomTile();
        this.addRandomTile();
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.handleKeyDown.bind(this), false);
    }

    render(){
        return(
            <div className="board-container">
            <Board boardState = {this.state.boardState}>
            </Board>
            </div>
            )
    }

}

export default Board1024