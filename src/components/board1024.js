import React from 'react'

const _ = require('lodash');
const Swipeable = require('react-swipeable')
let key = 0
const numOfRow = 4
const numOfCol= 4
let isGameOver = false
let tilesMoving = false
const KEYCODE ={
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39

}

function Tile(props){
    let style = {
        zIndex : props.ukey
    }
    
    let tileMerged = props.tileMerged || ''
    let tileNew = props.tileNew || ''
    return(
        <div className={"tile color-base " +props.className+" color-"+props.value+ ' '+tileMerged+' '+tileNew} data-ukey={props.ukey}  style={style}>
            <div>{props.value}</div>
        </div>
        )
}

function Board(props){
    let boardState = props.boardState;
    let tiles = [];
    
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


    tiles.sort((a, b) => b.props.ukey - a.props.ukey)
    
    return(
        <div className="board">
        <Grid/>
        {tiles}
        </div>
        )
}


function Grid(){
     let grids = [];
    _.times(16,(i)=>{
        grids.push(<div className="grid-slot" key={i}></div>)
    })
    return(
        <div>
        {grids}
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
        // generated tile value is 90% 2 and 10% 4
        let value = Math.random() < 0.9 ? 2 : 4

        boardState[c][r].tile.push({value: value, key: key, tileNew:'tile-new'}) 
        
        // update boardstate
        this.setState({
            boardState: boardState
        });

    }

    moveTiles(direction){
        if(isGameOver) return
        if(tilesMoving) return
        tilesMoving = true
        setTimeout(function(){ tilesMoving = false }, 100)
        let boardState = this.state.boardState
        let anyTileMoved = false


        let movement = (cv,ck, rv, rk)=>{
            if(boardState[ck][rk].tile.length){
                let head = boardState[ck][rk]

                //remove all but the last tile from head
                head.tile =  head.tile.slice(-1 * 1);
                let headTile = head.tile[0]
                
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
                    if(current[direction].tile.length>1) break
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
                        current.tile.push({value: headTile.value * 2, key: key, tileMerged: 'tile-merged'})
                    }else{
                        current.tile.push({value: headTile.value, key: headTile.key, tileMerged:'', tileNew:''})
                    }
                    
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

        if(!this.checkMovesLeft(boardState)) this.gameOver()
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

    swipedUp(){
        this.moveTiles('up')
    }

    swipedRight(){
        this.moveTiles('right')
    }

    swipedDown(){
        this.moveTiles('down')
    }

    swipedLeft(){
        this.moveTiles('left')
    }

    checkMovesLeft(boardState){
        let move =false
        _.each(boardState,(cv,ck)=>{
             _.each(boardState[ck],(rv,rk)=>{
                if(this.checkMovesLeftHelper(rv,"up")) move =true
                if(this.checkMovesLeftHelper(rv,"down")) move =true
                if(this.checkMovesLeftHelper(rv,"left")) move =true
                if(this.checkMovesLeftHelper(rv,"right")) move =true
            })

        })
        return move
    }
    
    checkMovesLeftHelper(rv, direction){
        let current = rv
        let left = current[direction]
        let move = false    
        if(left && current.tile.length){
            let currentTile = _.last(current.tile)
            let leftTile = _.last(left.tile) 
            
            if(!leftTile) move = true

            if(leftTile && currentTile.value == leftTile.value) move = true
        }
        return move
    }

    gameOver(){
        isGameOver = true
        
    }

    render(){
        return(
            <Swipeable 
                onSwipedUp={this.swipedUp.bind(this)}
                onSwipedRight={this.swipedRight.bind(this)}
                onSwipedDown={this.swipedDown.bind(this)}
                onSwipedLeft={this.swipedLeft.bind(this)}
            >
            <div className="board-container">
            <Board boardState = {this.state.boardState}>
            </Board>
            </div>
            </Swipeable>
            )
    }

}

export default Board1024