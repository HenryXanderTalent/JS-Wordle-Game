// Grab DOM elements
const message = document.getElementById('success-msg');
//returns the letters in an array
const letters = document.querySelectorAll('.wordboard-letter');

console.log(message)

console.log(letters)


async function init() {
    /**
     * Define following variables:
     * - currentGuess
     * - currentRow
     * - answerLength
     * - done
     */

    let currentGuess = '';
    let currentRow = 0;
    const answerLength = 5;

    /**
     * Make API call, get word of the day.
     * Create array of characters
     */

    const url = 'https://words.dev-apis.com/word-of-the-day';
    const res = await fetch(url);
    const data = await res.json();
    let wordOfTheDay = data.word.toUpperCase();
    let wordParts = wordOfTheDay.split('')


    function addLetter(letter) {
        // check if buffer is less than 5 characters
            // if so, add letter
            // if not, replace last letter with new letter
        
        if (currentGuess.length < answerLength) {

            currentGuess += letter;

        } else {
            //stops you from adding more letters than 5 in a row
            currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
            
        }

        letters[currentRow * answerLength + currentGuess.length - 1].textContent = letter;

    }

    function handleCommit(){
        // If word doesn't contain 5 letters...
        if(currentGuess.length !== answerLength) return;

        let guessParts = currentGuess.split('')
        console.log(guessParts)

        let wordMap = makeMap(wordParts)
        console.log(wordMap)

        // Mark 'correct', 'close', 'wrong' squares
        for(let i =0; i < answerLength; i++){
            if(guessParts[i] === wordParts[i]) {
                letters[currentRow * answerLength + i].classList.add('correct')
                wordMap[guessParts[i]]--
            }
        }

        for(let i = 0; i <answerLength; i++){

            if(guessParts[i] === wordParts[i]) {

                // do nothing, weve already handled this case ABOVE

            } else if (guessParts.includes(guessParts[i]) && wordParts[guessParts[i]] > 0) {

                letters[currentRow * answerLength + i].classList.add('close')
                wordMap[guessParts[i]]--

            } else {

                letters[currentRow * answerLength + i].classList.add('wrong')

            }
        }

        // Did the user win or lose?

        if(currentGuess === wordOfTheDay) {

            animate()
            message.textContent = 'YOU WIN!'
            message.classList.add('complete', 'wotd')

            } else if (currentRow === 5) {
                animate()
                message.innerHTML = `You lose! The word of the day is ${wordOfTheDay}`
                message.classList.add('complete')
            }

        // set currentGuess to empty string
        // increment currentRow

        currentGuess = '';
        currentRow++
        console.log(currentRow)

    }

    function handleBackspace() {
        // Modify currentGuess and update DOM
        currentGuess = currentGuess.substring(0, currentGuess.length - 1);
        //set the last letter to an empty string - see if statement below
        letters[currentRow * answerLength + currentGuess.length].textContent = '';
    }


    /**
     * Listen for keystrokes and perform actions based on the following:
     * 
     * - is the key Enter
     * - is the key Backspace
     * - is the key a valid letter
     * - otherwise...
     */
    document.addEventListener("keydown", function(event){
        //confirms keydown is working
        console.log('hi')
        //confirms which key has been pressed
        const action = event.key;
        console.log(action)

        if(action === 'Enter') {

            handleCommit();

        } else if (action === 'Backspace') {

            handleBackspace();

        } else if (isLetter(action)) {

            addLetter(action.toUpperCase());

        } else {



        }

    })
}

function isLetter(action) {
    // Check if keystroke is indeed a letter
    return /^[a-zA-Z]$/.test(action)
    //^makes it checks the first leter of string and $ checks last letter, used both together stops it checking capslock and focuses on only the letter keyed
}

function makeMap(array) {
    // Create object of characters along with amount of occurrences in word.
    const obj = {};

    for (let i = 0; i < array.length; i++) {

        if(obj[array[i]]) {

            obj[array[i]]++

        } else {

            obj[array[i]] = 1

        }
    }

    return obj;

}

init()