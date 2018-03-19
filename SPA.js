// ============================================================================
// GLOBALS
// ============================================================================
const rooms = ['Kitchen', 'Study', 'Living Room', 'Dining Room', 'Library'];
const guests = ['Mrs. Peacock', 'Mrs. Green', 'Miss Scarlet', 'Colonel Mustard', 'Professor Plum'];
const weapons = ['Pistol', 'Knife', 'Wrench', 'Lead Pipe', 'Candlestick'];
// ============================================================================
// SETUP LANDING PAGE
// ============================================================================
function setupLandingPage() {
  sessionStorage.setItem('history', []);
  document.getElementById('gameRoomList').innerHTML = rooms.join(', ');
  document.getElementById('gameGuestList').innerHTML = guests.join(', ');
  document.getElementById('gameWeaponList').innerHTML = weapons.join(', ');
  var greetingHtml = `
  <form>
    <strong>Name: </strong>
    <input type="text" id="userName" />
    <input type="submit" value="Submit" onclick="return setUser()" />
  </form>
  `;
  document.getElementById('greetingSection').innerHTML = greetingHtml;
  var roomSelector = document.getElementById('roomSelector');
  var suspectSelector = document.getElementById('suspectSelector');
  var weaponSelector = document.getElementById('weaponSelector');
  // set room selections
  for (room in rooms) {
    var option = document.createElement("option");
    option.text = rooms[room];
    roomSelector.add(option);
  }
  // set guest selections
  for (guest in guests) {
    var option = document.createElement("option");
    option.text = guests[guest];
    suspectSelector.add(option);
  }
  // set weapons selections
  for (weapon in weapons) {
    var option = document.createElement("option");
    option.text = weapons[weapon];
    weaponSelector.add(option);
  }

  var historyHtml = '<input type="submit" value="Show History" ' +
    'onclick="return showHistory()" disabled />' +
    '<input type="submit" value="Show Record" ' +
    'onclick="return showRecord()" />';
  document.getElementById('historySection').innerHTML = historyHtml;
}
// ============================================================================
// SET USER
// ============================================================================
function setUser() {
  var userName = document.getElementById('userName').value;
  sessionStorage.setItem('userName', userName);
  var greetingHtml = '<h3> Welcome ' + userName + '!</h3>'
  document.getElementById('greetingSection').innerHTML = greetingHtml;
  document.getElementById('guessButton').disabled = false;
  return shuffle();
}
// ============================================================================
// SHUFFLE CARDS
// ============================================================================
function shuffle() {
  var secret = {
    'room': getRandom(rooms),
    'guest': getRandom(guests),
    'weapon': getRandom(weapons)
  };
  var playerRooms = [];
  var playerGuests = [];
  var playerWeapons = [];
  var i;
  for (i = 0; i < rooms.length / 2; i++) {
    playerRooms.push(getRandom(rooms));
  }
  for (i = 0; i < guests.length / 2; i++) {
    playerGuests.push(getRandom(guests));
  }
  for (i = 0; i < weapons.length / 2; i++) {
    playerWeapons.push(getRandom(weapons));
  }
  var cards = {
    "secret": secret,
    "player": {
      "rooms": playerRooms,
      "guests": playerGuests,
      "weapons": playerWeapons
    },
    "computer": {
      "rooms": rooms,
      "guests": guests,
      "weapons": weapons
    }
  };
  var history = [];
  sessionStorage.setItem('cards', JSON.stringify(cards));
  sessionStorage.setItem('history', JSON.stringify(history));
  sessionStorage.setItem('isHistoryShown', 'false');
  var playerHand = getHand('player');
  var handHtml = document.getElementById('greetingSection').innerHTML +
    '<p>Your Cards: ' + playerHand.join(', ') + '</p>';
  var historyHtml = '<input type="submit" value="Show History" ' +
    'onclick="return showHistory()" />' +
    '<input type="submit" value="Show Record" ' +
    'onclick="return showRecord()" />';
  document.getElementById('greetingSection').innerHTML = handHtml;
  document.getElementById('historySection').innerHTML = historyHtml;
  return setGuessOptions();
}
// ============================================================================
// GET RANDOM ITEM
// ============================================================================
function getRandom(items) {
  var randomItem = items[Math.floor(Math.random() * items.length)];
  items.splice(items.indexOf(randomItem), 1);
  // return random item
  return randomItem;
}
// ============================================================================
// GET HAND
// ============================================================================
function getHand(target) {
  var cards = JSON.parse(sessionStorage.getItem('cards'));
  var hand = [];
  // add target room cards
  for (room in cards[target].rooms) {
    hand.push(cards[target].rooms[room]);
  }
  // add target guest cards
  for (guest in cards[target].guests) {
    hand.push(cards[target].guests[guest]);
  }
  // add target weapon cards
  for (weapon in cards[target].weapons) {
    hand.push(cards[target].weapons[weapon]);
  }
  // return hand
  return hand;
}
// ============================================================================
// GET GUESS OPTIONS
// ============================================================================
function getGuessOptions(target, cards) {
  var roomOptions = [];
  var guestOptions = [];
  var weaponOptions = [];
  roomOptions.push(cards.secret.room);
  guestOptions.push(cards.secret.guest);
  weaponOptions.push(cards.secret.weapon);
  // add computer room cards
  for (room in cards[target].rooms) {
    roomOptions.push(cards[target].rooms[room]);
  }
  // add computer guest cards
  for (guest in cards[target].guests) {
    guestOptions.push(cards[target].guests[guest]);
  }
  // add computer weapon cards
  for (weapon in cards[target].weapons) {
    weaponOptions.push(cards[target].weapons[weapon]);
  }
  // sort options
  roomOptions.sort();
  guestOptions.sort();
  weaponOptions.sort();
  // build result
  var options = {
    "rooms": roomOptions,
    "guests": guestOptions,
    "weapons": weaponOptions
  };
  return options;
}
// ============================================================================
// SET GUESS OPTIONS
// ============================================================================
function setGuessOptions() {
  var cards = JSON.parse(sessionStorage.getItem('cards'));
  var options = getGuessOptions("computer", cards);
  var roomSelector = document.getElementById('roomSelector');
  var suspectSelector = document.getElementById('suspectSelector');
  var weaponSelector = document.getElementById('weaponSelector');
  roomSelector.options.length = 0;
  suspectSelector.options.length = 0;
  weaponSelector.options.length = 0;
  // set room selections
  for (room in options.rooms) {
    var option = document.createElement("option");
    option.text = options.rooms[room];
    roomSelector.add(option);
  }
  // set guest selections
  for (guest in options.guests) {
    var option = document.createElement("option");
    option.text = options.guests[guest];
    suspectSelector.add(option);
  }
  // set weapons selections
  for (weapon in options.weapons) {
    var option = document.createElement("option");
    option.text = options.weapons[weapon];
    weaponSelector.add(option);
  }

  return false;
}
// ============================================================================
// PROCESS GUESS
// ============================================================================
function processGuess() {
  var cards = JSON.parse(sessionStorage.getItem('cards'));
  var guess = {
    "user": "Player",
    "room": document.getElementById("roomSelector").value,
    "guest": document.getElementById("suspectSelector").value,
    "weapon": document.getElementById("weaponSelector").value
  }
  addGuessToHistory(guess);
  // check if guess is correct
  if (guess.room == cards.secret.room &&
      guess.guest == cards.secret.guest &&
      guess.weapon == cards.secret.weapon) {
    addRecord(false);
    document.getElementById("messageSection").innerHTML = "YOU WON THE GAME!";
    showRecord();
  } else {
    var incorrectItem = getIncorrectCard(guess, cards);
    document.getElementById("messageSection").innerHTML = '<p>' +
      'You guessed ' + guess.guest +
      ' in the ' + guess.room +
      ' with the ' + guess.weapon +
      '.</p><p>The ' + incorrectItem + ' card is incorrect.</p>' +
      '<input type="submit" value="Continue" onclick="return compMove()" />';
  }

  document.getElementById("guessButton").disabled = true;

  return false;
}
// ============================================================================
// GET INCORRECT CARD
// ============================================================================
function getIncorrectCard(guess, cards) {
  var itemTypes = [ 'room', 'guest', 'weapon'];
  var randType = getRandom(itemTypes);

  if (guess[randType] == cards.secret[randType]) {
    randType = getRandom(itemTypes);
    if (guess[randType] == cards.secret[randType]) {
        randType = getRandom(itemTypes);
    }
  }

  var incorrectItem = guess[randType];
  return incorrectItem
}
// ============================================================================
// COMPUTER MOVE
// ============================================================================
function compMove() {
  var cards = JSON.parse(sessionStorage.getItem('cards'));
  var guess = getCompGuess(cards);
  addGuessToHistory(guess);
  // check if the guess is correct
  if (guess.room == cards.secret.room &&
      guess.guest == cards.secret.guest &&
      guess.weapon == cards.secret.weapon) {
    addRecord(true);
    var msg = '<p>THE COMPUTER WON THE GAME!</p>' +
      '<p>The computer guessed ' + guess.guest +
      ' in the ' + guess.room +
      ' with the ' + guess.weapon + '.</p>'
    document.getElementById("messageSection").innerHTML = msg;
    showRecord();
  } else {
    var incorrectItem = getIncorrectCard(guess, cards);
    document.getElementById("messageSection").innerHTML = '<p>' +
      'The computer guessed ' + guess.guest +
      ' in the ' + guess.room +
      ' with the ' + guess.weapon +
      '.</p><p>The ' + incorrectItem + ' card is incorrect.</p>' +
      '<input type="submit" value="Continue" onclick="return compCont()" />';
  }
  return false;
}
// ============================================================================
// GET COMPUTER GUESS
// ============================================================================
function getCompGuess(cards) {
  var options = getGuessOptions("player", cards);
  var guess = {
    "user": "Computer",
    "room": getRandom(options.rooms),
    "guest": getRandom(options.guests),
    "weapon": getRandom(options.weapons)
  };
  return guess;
}
// ============================================================================
// COMPUTER CONTINUE
// ============================================================================
function compCont() {
  document.getElementById("guessButton").disabled = false;
  document.getElementById("messageSection").innerHTML = "<p>Your Turn.</p>"
  return false;
}
// ============================================================================
// ADD GUESS TO HISTORY
// ============================================================================
function addGuessToHistory(guess) {
  var history = JSON.parse(sessionStorage.getItem('history'));
  history.push(guess);
  sessionStorage.setItem('history', JSON.stringify(history));

  var isHistoryShown = sessionStorage.getItem("isHistoryShown") == 'true';

  if (isHistoryShown) {
    showHistory();
  }
}
// ============================================================================
// SHOW HISTORY
// ============================================================================
function showHistory() {
  var history = JSON.parse(sessionStorage.getItem('history'));
  var html = '<input type="submit" value="Hide History" ' +
    'onclick="return hideHistory()" />' +
    '<input type="submit" value="Show Record" ' +
    'onclick="return showRecord()" />' +
    '<br />';

  if (history && history.length > 0) {
    html += '<ol>';

    for (item in history) {
      html += '<li>The ' + history[item].user +
        ' guessed ' + history[item].guest +
        ' in the ' + history[item].room +
        ' with the ' + history[item].weapon +
        '.</li>'
    }

    html += '</ol>';
  } else {
    html += '<p>Currently there is no game history. Make a move.</p>'
  }

  document.getElementById("historySection").innerHTML = html;
  sessionStorage.setItem('isHistoryShown', 'true');
  return false;
}
// ============================================================================
// HIDE HISTORY
// ============================================================================
function hideHistory() {
  var historyHtml = '<input type="submit" value="Show History" ' +
    'onclick="return showHistory()" />' +
    '<input type="submit" value="Show Record" ' +
    'onclick="return showRecord()" />';
  document.getElementById('historySection').innerHTML = historyHtml;
  sessionStorage.setItem('isHistoryShown', 'false');
  return false;
};
// ============================================================================
// SHOW RECORD
// ============================================================================
function showRecord() {
  var record = JSON.parse(localStorage.getItem('winRecord'));
  var html = '<input type="submit" value="Show History" ' +
    'onclick="return showHistory()" />' +
    '<input type="submit" value="Hide Record" ' +
    'onclick="return hideRecord()" /><br />';

  if (record) {
    html += "<p>The computer's win-loss record is: " +
      record.wins + " - " + record.losses + "</p><ul>";

    for (gameIndex in record.history) {
      var game = record.history[gameIndex];
      html += '<li>The computer ' + game.result +
        ' against ' + game.user + ' on ' + game.date + '.</li>';
    }

    html += "</ul>"
  } else {
    html += '<p>No win-loss record exists. Play a game to create one.</p>'
  }
  document.getElementById("historySection").innerHTML = html;
  sessionStorage.setItem('isHistoryShown', 'false');
  return false;
}
// ============================================================================
// HIDE RECORD
// ============================================================================
function hideRecord() {
  var html = '<input type="submit" value="Show History" ' +
    'onclick="return showHistory()" />' +
    '<input type="submit" value="Show Record" ' +
    'onclick="return showRecord()" />';

  document.getElementById("historySection").innerHTML = html;
  sessionStorage.setItem('isHistoryShown', 'false');
  return false;
}
// ============================================================================
// ============================================================================
function addRecord(compHasWin) {
  var record = JSON.parse(localStorage.getItem('winRecord'));
  var result = (compHasWin) ? 'won' : 'lost';
  var date = new Date();
  var datetime = date.toISOString().replace('T', ' ').replace(/\..*$/, '');
  // setup record if falsy
  if (!record) {
    record = {
      "wins": 0,
      "losses": 0,
      "history": []
    };
  }
  // build game result
  var gameResult = {
    "user": sessionStorage.getItem("userName"),
    "result": result,
    "date": datetime
  };
  // add result to history
  record.history.push(gameResult);
  // increment record
  if (compHasWin) {
    record.wins = record.wins + 1;
  } else {
    record.losses = record.losses + 1;
  }
  // update local storage
  localStorage.setItem('winRecord', JSON.stringify(record));
  return false;
}
