function DCN(val){
    return document.querySelector(`.${val}`)
}
function CEM(val){
    return document.createElement(val)
}
const board = DCN('board')
const black = '#769656'
const white = '#EEEED2'
const mySide = 'white'
let shownPossibleMoves;
let selectedPiece;
let move = 0

const piecesImageInfo = {
    'p_white': CEM('img').src='https://upload.wikimedia.org/wikipedia/commons/0/04/Chess_plt60.png',
    'p_black': CEM('img').src='https://upload.wikimedia.org/wikipedia/commons/c/cd/Chess_pdt60.png',
    'b_white': CEM('img').src='https://upload.wikimedia.org/wikipedia/commons/9/9b/Chess_blt60.png',
    'b_black': CEM('img').src='https://upload.wikimedia.org/wikipedia/commons/8/81/Chess_bdt60.png',
    'r_white': CEM('img').src='https://upload.wikimedia.org/wikipedia/commons/5/5c/Chess_rlt60.png',
    'r_black': CEM('img').src='https://upload.wikimedia.org/wikipedia/commons/a/a0/Chess_rdt60.png',
    'n_white': CEM('img').src='https://upload.wikimedia.org/wikipedia/commons/2/28/Chess_nlt60.png',
    'n_black': CEM('img').src='https://upload.wikimedia.org/wikipedia/commons/f/f1/Chess_ndt60.png',
    'k_white': CEM('img').src='https://upload.wikimedia.org/wikipedia/commons/3/3b/Chess_klt60.png',
    'k_black': CEM('img').src='https://upload.wikimedia.org/wikipedia/commons/e/e3/Chess_kdt60.png',
    'q_white': CEM('img').src='https://upload.wikimedia.org/wikipedia/commons/4/49/Chess_qlt60.png',
    'q_black': CEM('img').src='https://upload.wikimedia.org/wikipedia/commons/a/af/Chess_qdt60.png',
}
let piecePositions = {
    'r_black_1': [0, 0],
    'n_black_1': [0, 1],
    'b_black_1': [0, 2],
    'q_black': [0, 3],
    'k_black': [0, 4],
    'b_black_2': [0, 5],
    'n_black_2': [0, 6],
    'r_black_2': [0, 7],
    'p_black_1': [1, 0],
    'p_black_2': [1, 1],
    'p_black_3': [1, 2],
    'p_black_4': [1, 3],
    'p_black_5': [1, 4],
    'p_black_6': [1, 5],
    'p_black_7': [1, 6],
    'p_black_8': [1, 7],
    'r_white_1': [7, 0],
    'n_white_1': [7, 1],
    'b_white_1': [7, 2],
    'q_white': [7, 3],
    'k_white': [7, 4],
    'b_white_2': [7, 5],
    'n_white_2': [7, 6],
    'r_white_2': [7, 7],
    'p_white_1': [6, 0],
    'p_white_2': [6, 1],
    'p_white_3': [6, 2],
    'p_white_4': [6, 3],
    'p_white_5': [6, 4],
    'p_white_6': [6, 5],
    'p_white_7': [6, 6],
    'p_white_8': [6, 7],
}

// Make a Matrice of [            0   1   2   3   4   5   6   7
//                            0 ['', '', '', '', '', '', '', '']             |-------------> Row
//                            1 ['', '', '', '', '', '', '', '']             |
//                            2 ['', '', '', '', '', '', '', '']             | 
//                            3 ['', '', '', '', '', '', '', '']             |
//                            4 ['', '', '', '', '', '', '', '']             |
//                            5 ['', '', '', '', '', '', '', '']             |     
//                            6 ['', '', '', '', '', '', '', '']             |
//                            7 ['', '', '', '', '', '', '', '']             | Column               
//                                                                                              ]
const tiles = new Array(8).fill().map(()=>Array(8).fill(''))


//       [                           0      1   2   3   4   5   6   7
//                            0 ['white', '', '', '', '', '', '', ''],          
//                            1 ['black', '', '', '', '', '', '', ''],             
//                            2 ['white', '', '', '', '', '', '', ''],              
//                            3 ['black', '', '', '', '', '', '', ''],             
//                            4 ['white', '', '', '', '', '', '', ''],             
//                            5 ['black', '', '', '', '', '', '', ''],                 
//                            6 ['white', '', '', '', '', '', '', ''],             
//                            7 ['black', '', '', '', '', '', '', '']                     ]
tiles.forEach((tile, index)=>{
    if (index%2==0) {
        tile[0] = white
    }
    else{
        tile[0] = black
    }
})


//       [                           0       1         2        3       4       5        6          7
//                          0 ['white', 'black', 'white', 'black', 'white', 'black', 'white', 'black'],          
//                          1 ['black', 'white', 'black', 'white', 'black', 'white', 'black', 'white'],             
//                          2 ['white', 'black', 'white', 'black', 'white', 'black', 'white', 'black'],              
//                          3 ['black', 'white', 'black', 'white', 'black', 'white', 'black', 'white'],             
//                          4 ['white', 'black', 'white', 'black', 'white', 'black', 'white', 'black'],             
//                          5 ['black', 'white', 'black', 'white', 'black', 'white', 'black', 'white'],                 
//                          6 ['white', 'black', 'white', 'black', 'white', 'black', 'white', 'black'],             
//                          7 ['black', 'white', 'black', 'white', 'black', 'white', 'black', 'white']                   ]
tiles.forEach((column, columnNo)=>{
    column.forEach((row, rowNo)=>{
        if (rowNo>0) {
            if (column[rowNo-1] === white) {   
                column[rowNo] = black
            }
            else{
                column[rowNo] = white
            }
        }
    })
})


//All pieces Moves
function PawnMoves(position, color, firstMove=false){
    let possibleMoves = []
    let nextMove;
    if (move<=1) {
        firstMove=true
    }
    if (firstMove) {
        if (color===mySide) {
            nextMove = {column: position['column']-1, row : position['row']}
            if (!isObstacle(nextMove)) {
                possibleMoves.push(nextMove)
            }

            nextMove = {column: position['column']-2, row : position['row']}
            if (!isObstacle(nextMove)) {
                possibleMoves.push(nextMove)
            }
            
        }
        else{
            nextMove = {column: position['column']+1, row : position['row']}
            if (!isObstacle(nextMove)) {
                possibleMoves.push(nextMove)
            }

            nextMove = {column: position['column']+2, row : position['row']}
            if (!isObstacle(nextMove)) {
                possibleMoves.push(nextMove)
            }
        }
    }
    else{
        if (color===mySide) {
            nextMove = {column: position['column']-1, row : position['row']}
            if (!isObstacle(nextMove)) {
                possibleMoves.push(nextMove)
            }
            nextMove = {column: position['column']-1, row: position['row']+1}
            if (isObstacle(nextMove) && isObstacle(nextMove)['piece']['pieceColor']!==color) {
                possibleMoves.push(nextMove)
            }
            nextMove = {column: position['column']-1, row: position['row']-1}
            if (isObstacle(nextMove) && isObstacle(nextMove)['piece']['pieceColor']!==color) {
                possibleMoves.push(nextMove)
            }
        }
        else{
            nextMove = {column: position['column']+1, row : position['row']}
            if (!isObstacle(nextMove)) {
                possibleMoves.push(nextMove)
            }
            nextMove = {column: position['column']+1, row: position['row']+1}
            if (isObstacle(nextMove) && isObstacle(nextMove)['piece']['pieceColor']!==color) {
                possibleMoves.push(nextMove)
            }
            nextMove = {column: position['column']+1, row: position['row']-1}
            if (isObstacle(nextMove) && isObstacle(nextMove)['piece']['pieceColor']!==color) {
                possibleMoves.push(nextMove)
            }
        }
    }
    return possibleMoves
}
function knightMoves(position, color){
    let positionColumn = position['column']
    let positionRow = position['row']
    let possibleMoves = []

    let allMoves = [
        {column: positionColumn+2, row: positionRow+1},
        {column: positionColumn+2, row: positionRow-1},
        {column: positionColumn-2, row: positionRow+1},
        {column: positionColumn-2, row: positionRow-1},
        {column: positionColumn-1, row: positionRow+2},
        {column: positionColumn+1, row: positionRow+2},
        {column: positionColumn+1, row: positionRow-2},
        {column: positionColumn-1, row: positionRow-2},
    ]
    allMoves.forEach((move)=>{
        if (isValid(move)){
            if (!isObstacle(move) || (isObstacle(move) && isObstacle(move)['piece']['pieceColor'] !== color)) {   
                possibleMoves.push(move)
            }
            
        }
    })
    return possibleMoves
}
function bishopMoves(position, color){
    let positionColumn = position['column']
    let positionRow = position['row']
    let possibleMoves = []

    nextMove = {column:positionColumn-1, row:positionRow-1}
    if (isValid(nextMove) && !isObstacle(nextMove)) {
        possibleMoves.push(nextMove)
        while (1) {
            let nextMove = {column:possibleMoves.slice(-1)[0]['column']-1, row:possibleMoves.slice(-1)[0]['row']-1}
            if (isValid(nextMove) && !isObstacle(nextMove)) {
                possibleMoves.push(nextMove)
            }   
            else{
                if (isObstacle(nextMove) && isObstacle(nextMove)['piece']['pieceColor']!==color) {
                    possibleMoves.push(nextMove)
                    break
                }
                break
            }
        }
    }
    else{
        if (isObstacle(nextMove) && isObstacle(nextMove)['piece']['pieceColor']!==color) {
            possibleMoves.push(nextMove)
        }
    }


    nextMove = {column:positionColumn+1, row:positionRow+1}
    if (isValid(nextMove) && !isObstacle(nextMove)) {
        possibleMoves.push(nextMove)
        while (1) {

            let nextMove = {column:possibleMoves.slice(-1)[0]['column']+1, row:possibleMoves.slice(-1)[0]['row']+1}
            if (isValid(nextMove) && !isObstacle(nextMove)) {
                possibleMoves.push(nextMove)
            }   
            else{
                if (isObstacle(nextMove) && isObstacle(nextMove)['piece']['pieceColor']!==color) {
                    possibleMoves.push(nextMove)
                    break
                }
                break
            }
        }
    }
    else{
        if (isObstacle(nextMove) && isObstacle(nextMove)['piece']['pieceColor']!==color) {
            possibleMoves.push(nextMove)
        }
    }
    
    nextMove = {column:positionColumn-1, row:positionRow+1}
    if (isValid(nextMove) && !isObstacle(nextMove)) {
        possibleMoves.push(nextMove)
        while (1) {

            let nextMove = {column:possibleMoves.slice(-1)[0]['column']-1, row:possibleMoves.slice(-1)[0]['row']+1}
            if (isValid(nextMove) && !isObstacle(nextMove)) {
                possibleMoves.push(nextMove)
            }   
            else{
                if (isObstacle(nextMove) && isObstacle(nextMove)['piece']['pieceColor']!==color) {
                    possibleMoves.push(nextMove)
                    break
                }
                break
            }
        }
    }
    else{
        if (isObstacle(nextMove) && isObstacle(nextMove)['piece']['pieceColor']!==color) {
            possibleMoves.push(nextMove)
        }
    }

    nextMove = {column:positionColumn+1, row:positionRow-1}
    if (isValid(nextMove) && !isObstacle(nextMove)) {
        possibleMoves.push(nextMove)
        while (1) {
            let nextMove = {column:possibleMoves.slice(-1)[0]['column']+1, row:possibleMoves.slice(-1)[0]['row']-1}
            if (isValid(nextMove) && !isObstacle(nextMove)) {
                possibleMoves.push(nextMove)
            }   
            else{
                if (isObstacle(nextMove) && isObstacle(nextMove)['piece']['pieceColor']!==color) {
                    possibleMoves.push(nextMove)
                    break
                }
                break
            }
        }
    }
    else{
        if (isObstacle(nextMove) && isObstacle(nextMove)['piece']['pieceColor']!==color) {
            possibleMoves.push(nextMove)
        }
    }
    return possibleMoves
}   
function rookMoves(position, color) {
    let positionColumn = position['column']
    let positionRow = position['row']
    let possibleMoves = []

    nextMove = {column:positionColumn+1, row:positionRow}
    if (isValid(nextMove) && !isObstacle(nextMove)) {
        possibleMoves.push(nextMove)
        while (1) {
            let nextMove = {column:possibleMoves.slice(-1)[0]['column']+1, row:possibleMoves.slice(-1)[0]['row']}
            if (isValid(nextMove) && !isObstacle(nextMove)) {
                possibleMoves.push(nextMove)
            }   
            else{
                if (isObstacle(nextMove) && isObstacle(nextMove)['piece']['pieceColor']!==color) {
                    possibleMoves.push(nextMove)
                    break
                }
                break
            }
        }
    }
    else{
        if (isObstacle(nextMove) && isObstacle(nextMove)['piece']['pieceColor']!==color) {
            possibleMoves.push(nextMove)
        }
    }
    nextMove = {column:positionColumn-1, row:positionRow}
    if (isValid(nextMove) && !isObstacle(nextMove)) {
        possibleMoves.push(nextMove)
        while (1) {
            let nextMove = {column:possibleMoves.slice(-1)[0]['column']-1, row:possibleMoves.slice(-1)[0]['row']}
            if (isValid(nextMove) && !isObstacle(nextMove)) {
                possibleMoves.push(nextMove)
            }   
            else{
                if (isObstacle(nextMove) && isObstacle(nextMove)['piece']['pieceColor']!==color) {
                    possibleMoves.push(nextMove)
                    break
                }
                break
            }
        }
    }
    else{
        if (isObstacle(nextMove) && isObstacle(nextMove)['piece']['pieceColor']!==color) {
            possibleMoves.push(nextMove)
        }
    }
    
    nextMove = {column:positionColumn, row:positionRow+1}
    if (isValid(nextMove) && !isObstacle(nextMove)) {
        possibleMoves.push(nextMove)
        while (1) {

            let nextMove = {column:possibleMoves.slice(-1)[0]['column'], row:possibleMoves.slice(-1)[0]['row']+1}
            if (isValid(nextMove) && !isObstacle(nextMove)) {
                possibleMoves.push(nextMove)
            }   
            else{
                if (isObstacle(nextMove) && isObstacle(nextMove)['piece']['pieceColor']!==color) {
                    possibleMoves.push(nextMove)
                    break
                }
                break
            }
        }
    }
    else{
        if (isObstacle(nextMove) && isObstacle(nextMove)['piece']['pieceColor']!==color) {
            possibleMoves.push(nextMove)
        }
    }

    nextMove = {column:positionColumn, row:positionRow-1}
    if (isValid(nextMove) && !isObstacle(nextMove)) {
        possibleMoves.push(nextMove)
        while (1) {
            let nextMove = {column:possibleMoves.slice(-1)[0]['column'], row:possibleMoves.slice(-1)[0]['row']-1}
            if (isValid(nextMove) && !isObstacle(nextMove)) {
                possibleMoves.push(nextMove)
            }   
            else{
                if (isObstacle(nextMove) && isObstacle(nextMove)['piece']['pieceColor']!==color) {
                    possibleMoves.push(nextMove)
                    break
                }
                break
            }
        }
    }
    else{
        if (isObstacle(nextMove) && isObstacle(nextMove)['piece']['pieceColor']!==color) {
            possibleMoves.push(nextMove)
        }
    }
    return possibleMoves
}
function kingMoves(position, color){
    let positionColumn = position['column']
    let positionRow = position['row']
    let possibleMoves = []

    let allMoves = [
        {column: positionColumn, row: positionRow+1},
        {column: positionColumn+1, row: positionRow+1},
        {column: positionColumn-1, row: positionRow+1},
        {column: positionColumn+1, row: positionRow},
        {column: positionColumn-1, row: positionRow},
        {column: positionColumn+1, row: positionRow-1},
        {column: positionColumn, row: positionRow-1},
        {column: positionColumn-1, row: positionRow-1},
    ]
    allMoves.forEach((move)=>{
        if (isValid(move)){
            if (!isObstacle(move) || (isObstacle(move) && isObstacle(move)['piece']['pieceColor'] !== color)) {   
                possibleMoves.push(move)
            }
            
        }
    })
    return possibleMoves
}
function queenMoves(position, color) {
    let possibleMoves = rookMoves(position, color)
    possibleMoves = possibleMoves.concat(bishopMoves(position, color))
    return possibleMoves
}


// Utility Functions
function clearBoard(){
    document.querySelectorAll('.tile').forEach((tile)=>{
        let [tileColumn, tileRow] = tile.id.split('_').slice(1, 3)
        tile.style.background = tiles[tileColumn][tileRow]
    })
    document.querySelectorAll('.tile').forEach((tile)=>{
        tile.classList.remove('possibleMove')
        tile.classList.remove('captureTile')
    })
    shownPossibleMoves = undefined;
    
}
function clearMoves(){
    document.querySelectorAll('.tile').forEach((tile)=>{
        tile.classList.remove('possibleMove')
        tile.classList.remove('captureTile')
    })
}
function isValid(position){
    if (position['row']<8 && position['row']>=0 && position['column']<8 && position['column']>=0) {
        return true
    }
    else{
        return false
    }
}
function classlistIncludes(classlist, key){
    let found = false;
    Array(classlist).forEach((className)=>{
        if (className[0]===key) {
            found=true
        }
    })
    return found
}
function select(selectionTile){
    clearBoard()
    selectionTile.style.backgroundColor = '#BACA2B'
}
function displayPossibleMoves(movesArr){
    clearMoves()
    movesArr.forEach((move)=>{
        let tile = document.querySelector(`#pos_${move['column']}_${move['row']}`)
        if (Array.from(tile.childNodes).length>0) {
            tile.classList.add('captureTile')
        }
        else{
            tile.classList.add('possibleMove')
        }
    })
}
function isObstacle(position){
    let found = false
    document.querySelectorAll('.pieceImage').forEach((piece)=>{
        let piecePosition = pieceInfo(piece)['piecePosition']
        if (piecePosition['column']===position['column'] && piecePosition['row']===position['row']) {
            found = {status: true, piece: pieceInfo(piece)}
        }
    })
    return found
}
function pieceInfo(pieceImage){
    let pieceIdentity;
    let piecePosition = piecePositions[pieceImage.name];
    let pieceColor;
    Array(pieceImage.classList)[0].forEach((className)=>{
        // finding class ex: piece_black_p 
        if (className.split('_')[0]==='piece') {
            pieceIdentity = className.split('_')[2]
            pieceColor = className.split('_')[1]
        }
    })
    piecePosition = {
        'column': Number(piecePosition[0]),
        'row': Number(piecePosition[1])
    }
    return {
        pieceIdentity: pieceIdentity,
        piecePosition: piecePosition,
        pieceColor: pieceColor,
    }
    
}
function piecePossibleMoves(piece){
    let pieceIdentity;
    let pieceColor;
    let piecePosition;
    ({pieceIdentity, pieceColor, piecePosition} = pieceInfo(piece))
    let possibleMoves;
    switch (pieceIdentity) {
        case 'p':
            possibleMoves = PawnMoves(piecePosition, pieceColor)
            shownPossibleMoves = possibleMoves
            break;

        case 'n':
            possibleMoves = knightMoves(piecePosition, pieceColor)
            shownPossibleMoves = possibleMoves
            break;
        case 'b':
            possibleMoves = bishopMoves(piecePosition, pieceColor)
            shownPossibleMoves = possibleMoves
            break;
        case 'r':
            possibleMoves = rookMoves(piecePosition, pieceColor)
            shownPossibleMoves = possibleMoves
            break;
        case 'q':
            possibleMoves = queenMoves(piecePosition, pieceColor)
            shownPossibleMoves = possibleMoves
            break;
        case 'k':
            possibleMoves = kingMoves(piecePosition, pieceColor)
            shownPossibleMoves = possibleMoves
            break;

        default:
            break;
    }
    return possibleMoves
    

}
function tilePosition(tile){
    let tileID = tile.id
    let positionArr = tileID.split('_').slice(1, 3)
    let position = {
        column: Number(positionArr[0]),
        row: Number(positionArr[1]),
    }
    return position
}
function arrayToColumRowFormat(arr){
    return {column: arr[0], row: arr[1]}
}
function inside(fullArray, ObjecToFind){
    let found = false
    fullArray.forEach((singleObject)=>{
        if (singleObject['column'] === ObjecToFind['column'] && singleObject['row'] === ObjecToFind['row']) {
            found = true
        }
    })
    return found
}
function clickedRightColor(piece){
    let {pieceColor} = pieceInfo(piece)
    if (currentChance() === pieceColor) {
        return true
    }
    else{
        return false
    }
}
function currentChance(){
    let currentColor = move%2==0?'white':'black'
    return currentColor
}
function isKingSafe(color, newArr=false){
    let arrayTocheck = newArr?newArr:piecePositions
    let currentKingColor = color
    let opponentColor = currentKingColor==='white'?'black':'white'
    let kingPosition = arrayTocheck[`k_${currentKingColor}`]
    let result = true
    kingPosition = {
        column: kingPosition[0],
        row: kingPosition[1]
    }
    document.querySelectorAll('.pieceImage').forEach((piece)=>{
        if (piece.name.includes(opponentColor)) {
            if (piece.name==='b_white_2') {
            }
            if (inside(piecePossibleMoves(piece), kingPosition)) {
                result = false
            }
        }
    })
    return result
}
function isCheckMate(color){
    let originalArr = {...piecePositions}
    let mate = true
    document.querySelectorAll('.pieceImage').forEach((piece)=>{
        if (piece.name.includes(color)) {
            let allMoves = piecePossibleMoves(piece)
            allMoves.forEach((move)=>{
                let prevPiece;
                piecePositions[piece.name] = [move['column'], move['row']]
                let alreadyCaptured = document.getElementById(`pos_${move['column']}_${move['row']}`)
                if (alreadyCaptured.childNodes.length) {
                    prevPiece = alreadyCaptured.childNodes[0]
                    prevPiece.remove()
                    delete piecePositions[prevPiece.name]   
                }
                if (isKingSafe(currentChance())) {
                    if (prevPiece) {
                        alreadyCaptured.appendChild(prevPiece)                        
                    }
                    mate = false
                    piecePositions = {...originalArr}
                    return
                }
                else if(mate){
                    if (prevPiece) {
                        alreadyCaptured.appendChild(prevPiece)                        
                    }
                    piecePositions = {...originalArr}
                }
                else{
                    if (prevPiece) {
                        alreadyCaptured.appendChild(prevPiece)                        
                    }
                    piecePositions = {...originalArr}
                    return
                }
            })
        }
    })
    return mate
}
function gameOver(){
    let winner = currentChance()==='white'?'black':'white'
    alert(`${winner} has won the game`)
}
function movePiece(chosenSquare, chosenPiece, chosenPiecePositions, nextTurn=true){
    chosenPiece.style.position = 'absolute'
    let chosenSquarePosition = tilePosition(chosenSquare)

    //Self and Target Offsets
    let targetOffsetLeft = chosenSquare.getBoundingClientRect().left
    let targetOffsetTop = chosenSquare.getBoundingClientRect().top
    let selfOffsetLeft = chosenPiece.getBoundingClientRect().left
    let selfOffsetTop = chosenPiece.getBoundingClientRect().top
    let capturedPiece;
    let originalPositions = {...piecePositions}
    //Setting Self Positions to animate
    chosenPiece.style.left = selfOffsetLeft + 'px';
    chosenPiece.style.top = selfOffsetTop + 'px';

    //Time to load
    setTimeout(() => {
        chosenPiece.style.left = targetOffsetLeft + 6 + 'px';
        chosenPiece.style.top = targetOffsetTop + 6 + 'px';

        //Changing in original Data (piecePosition Array)
        piecePositions[selectedPiece] = [chosenSquarePosition['column'], chosenSquarePosition['row']]
        
        //Time for animation        
        setTimeout(() => {
            chosenSquare.appendChild(chosenPiece)

            //Capturing Piece
            if (chosenSquare.childNodes.length && chosenSquare.childNodes[0]!==chosenPiece) {
                capturedPiece = chosenSquare.childNodes[0]
                delete piecePositions[capturedPiece.name]
                capturedPiece.remove()
            }

            //Undo If king is on check
            if (!isKingSafe(currentChance()) && nextTurn) {
                if (capturedPiece) {
                    chosenSquare.appendChild(capturedPiece)
                    piecePositions[capturedPiece.name] = originalPositions[capturedPiece.name]
                }
                //undo
                let prevTile = document.querySelector(`#pos_${chosenPiecePositions['column']}_${chosenPiecePositions['row']}`)
                piecePositions[selectedPiece] = [chosenPiecePositions['column'], chosenPiecePositions['row']]
                movePiece(prevTile, chosenPiece, chosenPiecePositions, nextTurn=false)
            }

            //if not on check change the turn
            else{
                if (nextTurn) {
                    changeTurn()
                    if (!isKingSafe(currentChance())) {
                        if (isCheckMate(currentChance())) {
                            gameOver()
                        }
                    }
                }
            }
            }, 100);

        //Clearing all possible Moves and selections
        clearBoard()

    }, 10);
}
function changeTurn(){
    move++
}
function setBoard(){
    // adding tile to board with pieces  
    tiles.forEach((column, columnNo)=>{
        column.forEach((row, rowNo)=>{
        // Example Tile of column 3 and row 4 (row and column starts with 0)
        // <div class="tile" id="pos_3_4" style="background: rgb(118, 150, 86);"></div>

        let originalSquareColor = row
        let tile = document.createElement('div')
        tile.classList.add('tile')
        tile.style.background = originalSquareColor
        tile.id = `pos_${columnNo}_${rowNo}`
        let currentPiece;
        Object.keys(piecePositions).forEach((key)=>{
            let value = piecePositions[key]
            if (columnNo===value[0] && rowNo==value[1]) {
                currentPiece = key.split('_')
            }
        })
        if (currentPiece) {
            // Exampple Piece Image of pawn(p) situated on column 1 row 6
            // <img class="piece piece_black_p on_1_6" draggable="true" src="https://upload.wikimedia.org/wikipedia/commons/c/cd/Chess_pdt60.png">
            
            let pieceImage = document.createElement('img')
            black_or_white = currentPiece[1]
            pieceImage.classList.add('pieceImage')
            pieceImage.classList.add(`piece_${black_or_white}_${currentPiece[0]}`)
            pieceImage.classList.add(`on_${columnNo}_${rowNo}`) //No use now
            pieceImage.setAttribute('name', `${currentPiece.join('_')}`)
            pieceImage.draggable = true
            pieceImage.src = piecesImageInfo[`${currentPiece[0]}_${currentPiece[1]}`]
            tile.appendChild(pieceImage)
        }
        board.appendChild(tile)
    })
})
}

setBoard()

// selecting Squares On Clicking
document.querySelectorAll('.tile').forEach((tile)=>{
    tile.addEventListener('click', (e)=>{
        let chosenSquare;
        if (classlistIncludes(e.target.classList, 'pieceImage') && clickedRightColor(e.target)) {
            // parent tile on which person clicked
            chosenSquare = e.path[1]
            select(chosenSquare)
            selectedPiece = e.target.name

            displayPossibleMoves(piecePossibleMoves(e.target))
        }
        else{
            chosenSquare = e.target
            let chosenPiece = document.getElementsByName(selectedPiece)[0];
            let chosenSquarePosition = tilePosition(chosenSquare)

            //Moving Piece 
            if (shownPossibleMoves &&  inside(shownPossibleMoves, chosenSquarePosition)) {   
                movePiece(chosenSquare, chosenPiece, pieceInfo(chosenPiece)['piecePosition'])
            }
            else{
                selectedPiece = undefined;
                clearBoard()
            }
        }
    })
})
