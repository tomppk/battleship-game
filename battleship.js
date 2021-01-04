// three objects view, model, controller with separate reponsibilities

// the view object is responsible for updating the display when the state in the model changes
const view = {
    // method takes a string message and displays it
    // in display area
    displayMessage: function (msg) {
        const area = document.querySelector('#messageArea');
        area.textContent = msg;
    },

    // displays ship.png on board
    displayHit: function (location) {
        const hit = document.getElementById(`${location}`);
        hit.setAttribute('class', 'hit');
    },

    // displays miss.png on board
    displayMiss: function (location) {
        const miss = document.getElementById(`${location}`);
        miss.setAttribute('class', 'miss');
    }
};

// responsibility of the model is to store the state of the game and implement logic that modifies that state
const model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    ships: [
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] }],

    fire: function (guess) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            let index = ship.locations.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!");
                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my battleship!")
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed.")
        return false;
    },

    isSunk: function (ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    },

    generateShipLocations: function () {
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
        console.log("Ships array: ");
        console.log(this.ships);
    },

    generateShip: function () {
        const direction = Math.floor(Math.random() * 2);
        let row, col;

        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
            col = Math.floor(Math.random() * this.boardSize);
        }

        const newShipLocations = [];
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((col + i) + "" + row);

            }
        }
        return newShipLocations;
    },

    collision: function (locations) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = model.ships[i];
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }

};

// responsibility of the controller object is to glue the game together. make sure the players guess is sent to the model and check to see when the game is complete
const controller = {
    guesses: 0,
    processGuess: function (guess) {
        const location = this.parseGuess(guess);
        if (location) {
            this.guesses++;
            const hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sank all my battleships in " + this.guesses + " guesses.");
            }
        }

    },

    parseGuess: function (guess) {
        if (guess === null || guess.length !== 2) {
            alert("Oops, please enter a letter and a number on the board.")
            return null;
        };

        const letters = ["A", "B", "C", "D", "E", "F", "G"];
        let index = `${letters.indexOf(guess[0].toUpperCase())}`;

        if ((index < 0 || index >= this.boardSize) && (guess[1] < 0 || guess[1] >= this.boardSize)) {
            alert("Oops, please enter a letter and a number on the board.")
            return null;
        }

        return index.concat(guess[1]);
        // if checks not true then return null
    }
}

function init() {
    const fireButton = document.getElementById('firebutton');
    fireButton.onclick = handleFireButton;
    const guessInput = document.getElementById('guessinput');
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
}

function handleFireButton() {
    const guessInput = document.getElementById('guessinput');
    const guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = "";
}

function handleKeyPress(e) {
    const fireButton = document.getElementById('firebutton');
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }

}

window.onload = init;