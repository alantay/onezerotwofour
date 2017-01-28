import React from 'react'

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
        <div className={"tile " +props.className+" color-"+props.value} data-ukey={props.ukey}>
            <div>{props.value}</div>
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
            let grid = boardState[col][row]
            if(grid.tile.length){
                _.each(grid.tile, (obj, k)=>{
                    let key = obj.key;
                    tiles.push(
                        <Tile 
                            {...obj}
                            row={row} 
                            col={col} 
                            ukey={obj.key}
                            className={"pos-" + (col+1) + "-" + (row+1)}>
                        > 
                        </Tile>
                    )
                })
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
                        tArr[c].push({tile:[]});
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
                // if(!boardState[col][row].tile) boardState[col][row].tile =[]
                if(!boardState[col][row].tile.length){
                    unoccupiedGrid.push(col+" "+row)
                }
            })
        })
        
        // select random grid
        let gridToPopulate = _.sample(unoccupiedGrid).split(" ")

        // col 
        let c = gridToPopulate[0]

        // roll
        let r = gridToPopulate[1]

        // populate grid with tile
        // boardState[c][r].tile = []
        boardState[c][r].tile.push({value: 2, key: key}) 
        
        // update boardstate
        this.setState({
            boardState: boardState
        });
    }

    moveTiles(direction){
        let boardState = this.state.boardState
        let anyTileMoved = false


        let movement = (cv,ck, rv, rk)=>{
            if(boardState[ck][rk].tile.length){
                let head = boardState[ck][rk]
                let headTile = _.last(boardState[ck][rk].tile)
                
                // current is the iterated node
                let current = head

                let currentTile = null
                let move = false
                let valueUp = false

                // iterating through linked list

                // while the current node has a node above
                while(current[direction])
                {
                    // if there is a tile on the direction, choose its last tile
                    currentTile = _.last(current[direction].tile)
                    
                    // if there is a tile on the direction
                    if(currentTile){
                        // break away while loop if tile on direction is of different value
                        if(currentTile.value != headTile.value) break
                        valueUp = true
                        move = true
                    }else{
                        move = true
                    }
                    
                    // move the current node up
                    current = current[direction]
                    
                }

                if(move){
                    key++
                    if(valueUp){
                        current.tile.push({value: headTile.value, key: headTile.key})
                        current.tile.push({value: headTile.value * 2, key: key})
                    }else{
                        current.tile.push({value: headTile.value, key: headTile.key})
                    }
                    
                    // currentTile.value = valueUp? headTile.value * 2 : headTile.value 
                    // currentTile.key = headTile.key
                    boardState[ck][rk].tile = []
                    anyTileMoved = true
                }
                
            }
        }
        
        
        if(direction == 'up' || direction == 'left'){
            _.each(boardState,(cv, ck)=>{
                _.each(boardState[ck], (rv,rk)=>{
                    movement(cv,ck,rv,rk)
                })
            })
        }
        if(direction == 'down'){
            _.each(boardState,(cv, ck)=>{
                _.eachRight(boardState[ck], (rv,rk)=>{
                    movement(cv,ck,rv,rk)
                })
            })
        }  
        if(direction == 'right'){
            _.eachRight(boardState,(cv, ck)=>{
                _.each(boardState[ck], (rv,rk)=>{
                    movement(cv,ck,rv,rk)
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