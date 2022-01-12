"use strict";
const X_CLASS = 'x'
const CIRCLE_CLASS = 'circle'
const SHOW_CLASS = 'show'
const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
let circleTurn
const playSecond = document.getElementById('psecond')
const playFirst = document.getElementById('pfirst')
const restartButton = document.getElementById('restartButton')
const winningMessageTextElement = document.getElementById('winningText')
const winningMessageElement = document.getElementById('WinningMessage')
var turn = 1
var counter = 1
//var waiting = true
playSecond.addEventListener('click', second_turn)
playFirst.addEventListener('click', first_turn)
restartButton.addEventListener('click', first_turn)
var cpu_sym = 'O'
var player_sym = 'X'

var t = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']];
var index = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var flag = 0;

const cellId = {"cell0":{row:0, col:0},
                "cell1":{row:0, col:1},
                "cell2":{row:0, col:2},
                "cell3":{row:1, col:0},
                "cell4":{row:1, col:1},
                "cell5":{row:1, col:2},
                "cell6":{row:2, col:0},
                "cell7":{row:2, col:1},
                "cell8":{row:2, col:2}}



initialize()

function second_turn (){
    turn = 2
    cpu_sym = 'X'
    player_sym = 'O'
    initialize()
    cpu_turn()
    swapTurns();
    setBoardHoverClass();
    counter += 1;
}

function first_turn () {
    turn = 1;
    player_sym = 'X'
    cpu_sym = 'O'
    initialize();
}


function handleClick (e){
    const cell = e.target
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS
    placeMark (cell, currentClass)
    var r = cellId[cell.id].row;
    var c = cellId[cell.id].col;
    if (circleTurn) {
        t[cellId[cell.id].row][cellId[cell.id].col] = 'O';
    } else {
        t[cellId[cell.id].row][cellId[cell.id].col] = 'X';
    }
    var x = (3 * r) + c + 1
    index[counter] = x
    swapTurns()
    setBoardHoverClass()
    flag = check_win()
    counter += 1
    if ((flag != 0) || (counter == 10)) {
        if (flag == 0){
            winningMessageTextElement.innerHTML = 'Match Draw!!!'
        } else if (flag == 1){
            winningMessageTextElement.innerHTML = 'Player wins!'
        } else if (flag == 2) {
            winningMessageTextElement.innerHTML = 'Player looses!!'
        }
        document.getElementById('winningMessage').className += ' ' + SHOW_CLASS
    } else {
        cpu_turn ();
        flag = 2*check_win();
        swapTurns();
        setBoardHoverClass();
        counter += 1;
        if ((flag != 0) || (counter == 10)) {
            if (flag == 0){
                winningMessageTextElement.innerHTML = 'Match Draw!!!'
            } else if (flag == 1){
                winningMessageTextElement.innerHTML = 'Player wins!'
            } else if (flag == 2) {
                winningMessageTextElement.innerHTML = 'Player looses!!'
            }
            document.getElementById('winningMessage').className += ' ' + SHOW_CLASS
        }
    }
}

function swapTurns(){
    circleTurn = !circleTurn
}

function placeMark (cell, currentClass){
    cell.classList.add(currentClass)
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS)
    board.classList.remove(CIRCLE_CLASS)
    if (circleTurn) {
        board.classList.add(CIRCLE_CLASS)
    } else {
        board.classList.add(X_CLASS)
    }
}



function check_hor()						//checks if there is match in any of the rows for a win
{
	var i;
    var flag = 0;
	for (i=0; i<3; i++)	{
		if ((t[i][0] == t[i][1]) && (t[i][1] == t[i][2]) && (t[i][2] != ' ')) {
			flag = 1;
			break;
		}
	}
	return flag;							//returning the result
}

function check_ver()						//checks if there is a match in any of the columns for a win
{
	var i;
    var flag = 0;
	for (i=0; i<3; i++) {
		if ((t[0][i] == t[1][i]) && (t[1][i] == t[2][i]) && (t[2][i] != ' ')) {
			flag = 1;
			break;
		}
	}
	return flag;							//returning the result
}

function check_dia()						//checks the diagonal elements for a win situation
{
	var flag = 0;
	if ((t[0][0] == t[1][1]) && (t[1][1] == t[2][2]) && (t[2][2] != ' ')) {
		flag = 1;
    } else if ((t[0][2] == t[1][1]) && (t[1][1] == t[2][0]) && (t[1][1] != ' ')) {
		flag = 1;
    }
	return flag;							//returns the result
}

function check_win()						//a function to check for win in the board in all type of cases
{
	return (check_hor() || check_ver() || check_dia());	//checks horizontally, vertically, digonally and returns the result
}

function prob_hor(sym)					//a function to check for win/loose situation in horizontal rows at that turn
{
	var i;
    var j;
    var count;
	for (i=0; i<3; i++)
	{
		count = 0;
		for (j=0;j<3;j++) {
			if (t[i][j] == sym) {
				count++;
            }
        }
		if (count == 2) {
			for (j=0; j<3;j++) {
				if (t[i][j] == ' ') {
					return (3*i + j + 1);
                }
            }
        }
	}
	return 0;							//if no such cases are there then returns 0
}

function prob_ver(sym)					//a function to check for win/loss situation in vertical columns at that turn
{
	var i;
    var j;
    var count;
	for (i=0; i<3; i++) {
		count = 0;
		for (j=0;j<3;j++) {
			if (t[j][i] == sym) {
				count++;
            }
        }
		if (count == 2)	{				//checks if the column has already two elements of that type
			for (j=0; j<3;j++) {
				if (t[j][i] == ' ') {
					return (3*j +i+1);
                }
            }
        }
	}
	return 0;							//if no such cases are there then returns 0
}

function prob_dia(sym)					//a function to check for win/loose situation diagonally
{
	var i;
    var count = 0;
	for (i=0; i<3; i++) {
		if (t[i][i] == sym) {					//checks in diagonl 1, 5, 9
			count++;
        }
    }
	if (count == 2)	{					//checks if it has two elements of that type
		for (i=0; i<3;i++) {
			if (t[i][i] == ' ') {
				return (4*i + 1);
            }
        }
    }
	count = 0;
	for (i=0;i<3; i++) {
		if (t[i][2-i] == sym) {
			count++;
        }
    }
	if (count == 2) {						//checks if it has two elements of that type
		for (i=0; i<3;i++) {
			if (t[i][2-i] == ' ') {
				return (2*i + 3);
            }
        }
    }
	return 0;							//returns 0 if no such cases exist
}

function prob(sym)					//a function to check for probable win or loose cases in complete board for that turn
{
	var x;
    var y;
    var z;
	x = prob_hor(sym);						//calling a function to check for probable win/loose case horizontally
	if (x != 0) {
		return x;
    }
	y = prob_ver(sym);						//calling a function to check for probable win/loose case vertically
	if (y != 0) {
		return y;
    }
	z = prob_dia(sym);						//calling a function to check for probable win/loose case diagonally
	if (z != 0) {
		return z;
    } else {
		return 0;						//returns 0 if no such cases are there
    }
}




function cpu_turn()		//cpu turn for generating automatic position
{
	var x;
    var y;
    var i;
	if (counter == 1){
		x = 1;
    } else if (counter == 3) {
		if (index[2] == 2) {
			x = 7;
        } else if ((index[2] == 3) || (index[2] == 7)) {
			x = 9;
        } else if (index[2] == 4) {
			x = 3;
        } else if (index[2] == 5) {
			x = 9;
        } else if (index[2] == 6) {
			x = 3;
        } else if (index[2] == 8){
			x = 7;
        } else if (index[2] == 9) {
			x = 3;
        }
	} else if (counter == 5) {
		x = prob(cpu_sym);					//checks if it can win in that turn
		if (x==0)
		{
			x = prob(player_sym);			//checks if it can loose after that turn, and prevents it
			if (x == 0)					//if no such cases exist then goes for some defined sequence
			{
				if ((index[2] == 2) || (index[2] == 4)) {
					x = 9;
                } else if ((index[2] == 3) || (index[2] == 6) || (index[2] == 9)) {
					x = 7;
                } else if ((index[2] == 7) || (index[2] == 8)) {
					x = 3;
                }
			}
		}
	} else if (counter == 2) {
		if ((index[1] == 1) || (index[1] == 3) || (index[1] == 7) || (index[1] == 9)) {
			x = 5;
        } else if (index[1] == 5) {
			x = 1;
        } else {
			x = 10 - index[1];
        }
	} else if (counter == 4) {
		x = prob(player_sym);			//checks for loosing possibility only as it can not win at this point
		if (x == 0)					//if no such cases are there then goes for pre defined sequence depending on the player's input in various turns
		{
			if (index[1] == 1)
			{
				if (index[3] == 8) {
					x = 6;
                } else if (index[3] == 6) {
					x = 8;
                } else if (index[3] == 9) {
					x = 2;
                }
			} else if (index[1] == 3) {
				if (index[3] == 8) {
					x = 4;
                } else if (index[3] == 4) {
					x = 8;
                } else if (index[3] == 7) {
					x = 2;
                }
			} else if (index[1] == 7) {
				if (index[3] == 2) {
					x = 4;
                } else if (index[3] == 4) {
					x = 2;
                } else if (index[3] == 3) {
					x = 2;
                } else if (index[3] == 6) {
                    x = 9;
                }
			} else if (index[1] == 9) {
				if (index[3] == 2) {
					x = 4;
                } else if (index[3] == 4) {
					x = 2;
                } else if (index[3] == 1) {
					x = 2;
                }
			} else if (index[1] == 5) {
				x = 3;
            } else if (index[1] == 2) {
				if ((index[3] == 4) || (index[3] == 9) || (index[3] == 5)) {
					x = 1;
                } else if ((index[3] == 6) || (index[3] == 7)) {
					x = 3;
                }
			} else if (index[1] == 4) {
				if ((index[3] == 8) || (index[3] == 3) || (index[3] == 5)) {
					x = 7;
                } else if ((index[3] == 2) || (index[3] == 9)) {
					x = 1;
                }
			} else if (index[1] == 6) {
				if ((index[3] == 2) || (index[3] == 7) || (index[3] == 5)) {
					x = 3;
                } else if ((index[3] == 8) || (index[3] == 1)) {
					x = 9;
                }
			} else if (index[1] == 8) {
				if ((index[3] == 4) || (index[3] == 3) || (index[3] == 5)) {
					x = 7;
                } else if ((index[3] == 6) || (index[3] == 1)) {
					x = 9;
                }
			}	
		}
	} else if ((counter == 6) || (counter == 7) || (counter == 8) || (counter == 9)) {
		x = prob(cpu_sym);								//checks for win in that turn
		if (x == 0)
		{
			x = prob(player_sym);						//checks for loosing after that turn and prevents it
			if (x == 0)
			{
				x = prob(' ');						//checks for two blank spaces in a row/column/diagonal
				if (x == 0) {
					for (i=0;i<3;i++) {
						for (y=0; y<3; y++) {
							if (t[i][y] == ' ') {
								x = 3*i + y + 1;
                            }
                        }
                    }
                }
			}
		}
	}
	index[counter] = x;
	x -= 1;
    var rem = x % 3
	t[(x-rem)/3][rem] = cpu_sym;
    cellElements[x].removeEventListener('click', handleClick)
    if (circleTurn) {
        cellElements[x].classList.add(CIRCLE_CLASS)
    } else {
        cellElements[x].classList.add(X_CLASS)
    }
    
    //puts the cpu symbol in that place of grid
}




function initialize()											//main function for executing all the codes
{
    circleTurn = false;
    counter = 1;
	cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS)
        cell.classList.remove(CIRCLE_CLASS)
        cell.removeEventListener('click', handleClick)
        cell.addEventListener('click', handleClick, { once: true})
    })
    setBoardHoverClass();
    document.getElementById('winningMessage').className = document.getElementById('winningMessage').className.replace(' ' + SHOW_CLASS, '')
    //winningMessageTextElement.innerHTML = 'x';
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++){
            t[i][j] = ' ';
        }
    }							//empties the board for match
    for (let i=0; i<10; i++){
        index[i] = 0;
    }						//an array to store positions in different turns (clears it for next match)
    flag = 0;
   					//calls the function to start game								//keep playing if the user gives input for that					//stops the game play and exit if the user gives input for that
}