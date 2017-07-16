var players = [
'Barbay Ádám',
'Bodóczky Mihály',
'Czető Márton',
'Decsics Gergely',
'Diera Andor',
'Hadiné Gubics Andrea',
'Hallak Hella',
'Molnár László',
'Németh Zoltán',
'Rátkay András',
'Sándor Zoltán Péter',
'Soltesz Alexander',
'Szabó Erik Márk',
'Szabó Péter',
'Szilberhorn Zoltán',
'Taigiszer Dóra',
'Timpfel Gábor',
'Tóth Sára',
'Mező Imre',
'Koncz Gergely'];

var standings = [];
var nodeStanding = document.getElementById('eredmeny');
var teams =[];
var fixtures = [];
// a játékosokból generálunk random csapatokat objektumként, és minden csapatot pusholunk a teams tömbbe
function teamCreator(players){
    var playersnew = players.slice();
    var len = players.length/2;
    for (i=0; i<len;i++){
        var rand1 = Math.floor(Math.random() * playersnew.length);
        var player1spl = playersnew.splice(rand1, 1);
        var rand2 = Math.floor(Math.random() * playersnew.length);
        var player2spl = playersnew.splice(rand2, 1);
        teams.push({
            nev1: player1spl[0],
            nev2: player2spl[0],
            points: 0,
            won: 0,
            lost: 0,
            draw: 0,
            scored: 0,
            conceded: 0,
            });
        }
    return teams;
};

// Megcsináljuk a bajnokság sorsolását round-robin algoritmussal, ami annyit tesz, hogy minden fordulóban az első csapat helye fix a tömbben, a többit pedig
// az óra járásával egyező irányban forgatjuk fordulónként
function fixtureAlgorithm(teams){
    var size = teams.length;
    var half = size / 2;
    for (var i=0; i < (size-1); i++){
        // létrehozunk a teams tömbből két tömböt felezéssel, aminek mindig a megegyező indexű csapatait párositjuk össze, ezt csinálja a for j ciklus
        var left = teams.slice(0, half);
        var right = teams.slice(half).reverse();
        var rounds = [];
        for (var j=0; j<half; j++){
            rounds.push([left[j], right[j]]);
            }
        // majd a fordulót betesszük a fixtures tömbbe és a for i ciklus összes lefutása utánra kész is az egész szezon sorsolása
        fixtures.push(rounds);   
        // a következő fordulóhoz elforgatjuk a teams elemeit úgy, hogy levágjuk az utolsót és betesszük az első után
        teams.splice(1, 0, teams.pop());
        }
    return fixtures;
};
fixtureAlgorithm(teams);

// fordulók: fixtures kerül bele a playMatch függvénybe, amiből levágja az éppen aktuális fordulót
function playMatch(fixtures){
if (fixtures.length == 0){
        alert('Lejátszottuk az összes fordulót már!');
        return;
    }

    var seasonRound = fixtures.shift();
    for (var i=0; i<seasonRound.length; i++ ){
        var goalScored = Math.round(Math.random()*10);
        var goalConceded = (10 - goalScored);
        seasonRound[i][0].scored = goalScored;
        seasonRound[i][0].conceded = goalConceded;
        seasonRound[i][1].scored = goalConceded;
        seasonRound[i][1].conceded = goalScored;
        if (goalScored > goalConceded){
            seasonRound[i][0].points = 3;
            seasonRound[i][0].won = 1;
            seasonRound[i][0].lost = 0;
            seasonRound[i][0].draw = 0;
            seasonRound[i][1].points = 0;
            seasonRound[i][1].won = 0;
            seasonRound[i][1].lost = 1;
            seasonRound[i][1].draw = 0;    
        }
        else if (goalScored < goalConceded){
            seasonRound[i][0].points = 0;
            seasonRound[i][0].won = 0;
            seasonRound[i][0].lost = 1;
            seasonRound[i][0].draw = 0;
            seasonRound[i][1].points = 3;
            seasonRound[i][1].won = 1;
            seasonRound[i][1].lost = 0;
            seasonRound[i][1].draw = 0;
        }
        else if (goalConceded == goalScored){
            seasonRound[i][0].points = 1;
            seasonRound[i][0].won = 0;
            seasonRound[i][0].lost = 0;
            seasonRound[i][0].draw = 1;
            seasonRound[i][1].points = 1;
            seasonRound[i][1].won = 0;
            seasonRound[i][1].lost = 0;
            seasonRound[i][1].draw = 1;
        }
    }
    var results = JSON.parse(JSON.stringify(seasonRound));
    standings.push(results);
}

playMatch(fixtures);
playMatch(fixtures);
playMatch(fixtures);
playMatch(fixtures);
playMatch(fixtures);
playMatch(fixtures);
playMatch(fixtures);
playMatch(fixtures);
playMatch(fixtures);

function tableStanding(){
    for (i=0;i<standings.length;i++){

    var tableName = '';
    var tableWon = 0;
    var tableDraw = 0;
    var tableLost = 0;
    var tableScored = 0;
    var tableConceded = 0;
    var tableGoalDifference = 0;
    var tablePoints = 0;
        

}

}