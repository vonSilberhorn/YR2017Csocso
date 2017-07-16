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
var tableIter = [];
// a játékosokból generálunk random csapatokat objektumként, és minden csapatot pusholunk a teams tömbbe
function teamCreator(players){
    var teamsNode = document.getElementById('csapatok');
    teamsNode.innerHTML='';  // kinullázuk a html-ben a csapatok részt, hogy újrasorsolásnál csak az újrasorsolt csapatok jelenjenek meg.
    teams =[]; // kinullázuk a teams tömböt is arra az esetre, ha újrasorsolánk, akkor az újrasorsolt csapatokat ne a már felöltött tömbhöz adja hozzá
    var playersnew = players.slice(); // lemásoljuk az eredeti players tömböt, hogy ne azt szedjük majd szét
    var len = players.length/2;
    for (i=0; i<len;i++){
        var rand1 = Math.floor(Math.random() * playersnew.length); //random kiválasztunk egy nevet
        var player1spl = playersnew.splice(rand1, 1);  // gyors ki is vesszük, hogy ne kerülhessen be megint
        var rand2 = Math.floor(Math.random() * playersnew.length); // random kiválasztunk még egy nevet
        var player2spl = playersnew.splice(rand2, 1); // ezt is gyors kivesszük, és akkor kész is egy csapat, két ember nevével
        if ((player1spl[0] == 'Mező Imre' && player2spl[0] == 'Koncz Gergely') || (player2spl[0]=='Mező Imre' && player1spl[0] == 'Koncz Gergely')){
            document.getElementById('generator').disabled = true;
        }
        teams.push({ // egy csapat objektum igy fog kinézni: nevek, pontok, nyert-vesztett-döntetlen meccsek száma, lőtt és kapott gólok
            nev1: player1spl[0],
            nev2: player2spl[0],
            points: 0,
            won: 0,
            lost: 0,
            draw: 0,
            scored: 0,
            conceded: 0,
            }); // belökjük a csapat objektumát a teams tömbbe, a for i ciklus lefutásával meglesz a 10 csapat.
        // majd a kisorsolt csapatok neveit kiirjuk html-be (még a for i ciklusban vagyunk)
        teamsNode.innerHTML += '<span> ' +'|| ' + (i+1) + '. ' + player1spl[0] + ' & ' + player2spl[0] + ' ||' + ' </span>'
        }
    document.getElementById('szezon').disabled = false;
    return teams; // visszaadjuk egy tiz elemű tömbben a csapatokat objektumokként, ezt fogja a következő fixtureAlgorithm függvény használni
}

// Megcsináljuk a bajnokság sorsolását round-robin algoritmussal, ami annyit tesz, hogy minden fordulóban az első csapat helye fix a tömbben, a többit pedig
// az óra járásával egyező irányban forgatjuk fordulónként
function fixtureAlgorithm(teams){
    var size = teams.length;
    var half = size / 2;
    var nodeFixtures = document.getElementById('sorsolas');
    for (var i=0; i < (size-1); i++){
        // létrehozunk a teams tömbből két tömböt felezéssel, aminek mindig a megegyező indexű csapatait párositjuk össze, ezt csinálja a for j ciklus
        var left = teams.slice(0, half);
        var right = teams.slice(half).reverse(); // a második tömbb elemeinek sorrendjét megforditjuk, ez a round robin algoritmus része
        var rounds = [];
        for (var j=0; j<half; j++){  // úgy állitjuk össze a meccspárokat, hogy egy objektum első két eleme a két csapatobjektum lesz, a másik két eleme pedig az...
            rounds.push({            // ... aktuális meccsen lőtt gólok száma. Erre azért van szükség, hogy fordulónként egyszerű legyen megjeleniteni az...
                homeTeam: left[j],   // ... altuális eredményt html-ben, viszont a két csapatobjektumban gyűlni fog az egy-egy csapat összesitett eredménye.
                awayTeam: right[j],
                homeGoals: 0,
                awayGoals: 0
            })
            }
        // a fordulót betesszük a fixtures tömbbe és egy forduló már meg is van (a for i ciklus összes lefutása utánra kész az egész szezon sorsolása is)
        fixtures.push(rounds);   
        // a következő fordulóhoz elforgatjuk a teams elemeit úgy, hogy levágjuk az utolsót és betesszük az első után -ezt felezi meg fentebb a for i ciklus kapásból
        teams.splice(1, 0, teams.pop());
        }
    nodeFixtures.innerText = 'Kész a szezon sorsolása!' // lefut a for i ciklus, kiirjuk html-be, hogy kész a sorsolás
    document.getElementById('generator').disabled = true; // kikapcsoljuk a csapatgeneráló gombot, hogy a szezon sorsolása után ne lehessen új csapatokat létrehozni
    document.getElementById('szezon').disabled = true; // kikapcsoljuk a szezon sorsolás gombot is, hogy ne lehessen újra sorsolni (amúgy ugyanaz jönne ki mindig)
    document.getElementById('fordulok').disabled = false;
    return fixtures; // a fixtures egy 9 elemű tömb, amiben minden elem egy-egy forduló, a fordulókon belül minden elem egy-egy párositás
                     // ezt a fixtures tömböt fogja a playMatch függvény (az egyes fordulók lejátszásához) használni, mégpedig úgy, hogy mindig levágja a fixtures ...
                     // ... tömb első elemét
}

// fordulók: fixtures kerül bele a playMatch függvénybe, amiből levágja az éppen soron következő fordulót
function playMatch(fixtures){
    if (fixtures.length == 0){
        alert('Lejátszottuk az összes fordulót már!');
        document.getElementById('fordulok').disabled = true;
        return;  // ha már nincs több forduló, akkor alertezés után kiugrik a függvényből
    }
    nodeStanding.innerHTML = '';
    var seasonRound = fixtures.shift(); // itt vágjuk le az első elemet (fordulót), aminek lejátsszuk a meccseit

    for (var i=0; i<seasonRound.length; i++ ){ // hozzáadogatjuk a kirandomolt eredményt a csapatobjektumokhoz (amikben fordulóról fordulóra összeadódik a csapat...
        var goalScored = Math.round(Math.random()*10); //...összeredménye), illetve hozzáadjuk a gólok számát az meccspárok objektumának utolsó két eleméhez, hogy...
        var goalConceded = (10 - goalScored);  // ... azt jelenitsük majd meg az aktuális fordulóban a html-ben. Ezt csinálja végig a for i ciklus if, else if, ...
        seasonRound[i].homeGoals = goalScored  // ... else ágaival, ahol az if a hazai csapat győzelme, az else if az idegenbeli csapat győzelme, az else ...
        seasonRound[i].awayGoals = goalConceded// ... pedig a döntetlen
        seasonRound[i].homeTeam.scored += goalScored;
        seasonRound[i].homeTeam.conceded += goalConceded;
        seasonRound[i].awayTeam.scored += goalConceded;
        seasonRound[i].awayTeam.conceded += goalScored;
        if (goalScored > goalConceded){
            seasonRound[i].homeTeam.points += 3   // a += miatt a csapatobjektumokban az összesitett eredmény gyűlik
            seasonRound[i].homeTeam.won += 1;
            seasonRound[i].awayTeam.lost += 1    
        }
        else if (goalScored < goalConceded){
            seasonRound[i].homeTeam.lost += 1;
            seasonRound[i].awayTeam.points += 3;
            seasonRound[i].awayTeam.won += 1;
        }
        else if (goalConceded == goalScored){
            seasonRound[i].homeTeam.points += 1;
            seasonRound[i].homeTeam.draw += 1;
            seasonRound[i].awayTeam.points += 1;
            seasonRound[i].awayTeam.draw += 1;
        }
        // eddigre lejátszottunk egy meccset, aminek az eredményeit kiirjuk html-be a megfelelő asztalokhoz (még a for i ciklusban vagyunk)
        var temp1 = i + 1 + 'asztal4';
        var temp2 = i + 1 + 'asztal6';
        var temp3 = i + 1 + 'asztal10';
        var temp4 = i + 1 + 'asztal12';
        document.getElementById(temp1).innerText = seasonRound[i].homeTeam.nev1 + ' & ' + seasonRound[i].homeTeam.nev2;
        document.getElementById(temp2).innerText = seasonRound[i].homeGoals;
        document.getElementById(temp3).innerText = seasonRound[i].awayTeam.nev1 + ' & ' + seasonRound[i].awayTeam.nev2;
        document.getElementById(temp4).innerText = seasonRound[i].awayGoals;
    }
    // mostanra futott le a ciklus, ez lejátszott 5 meccset és kiirta az eredményeket az öt asztahoz
    standings.push(seasonRound); // hozzáadjuk a forduló eredményeit a standings tömbhöz
    protoTable(standings); // a standingsre ráhivjuk a protoTable függvényt, hogy sorbarendezze a csapatokat (lásd lentebb).A függvény...
                           // ... returnja a tiz csapatból álló tömb lesz, pontok és gólkülönbség szerint sorbarendezve (tableIter a return változó neve)
    showTable(tableIter); // a protoTable returnjére ráhivjuk ezt a függvényt, ami kipakolja az aktuális forduló utáni állást html-be.
}

function protoTable(standings){  // ez összerendezi nekünk az eredményeket pontok szerint csökkenő sorrendben (ami a tabellához kell)
    var tableGen = standings[0]; // kiválasztjuk a standings nulladik elemét. Ez mindig megfelelő lesz, mivel a nulladik elem csapatobjektumaiban sosem csak az...
    tableIter = [];              // ... adott forduló eredményei vannak, hanem abban mindig a csapatok adott fordulóig meglévő összeredménye szerepel
    for (var k = 0; k < tableGen.length; k++){  // kivesszük a csapatobjektumokat egy tömbbe, ahol csak a csapatobjektumok fognak szerepelni
        tableIter.push(tableGen[k].awayTeam);
        tableIter.push(tableGen[k].homeTeam);
        }
    for (var i = 0; i < tableIter.length-1; i++){ // rálökünk egy pontszám szerinti rendezést
        for (var j = i + 1; j < tableIter.length; j++){
            if (tableIter[j].points > tableIter[i].points){
            var temp = [tableIter[i], tableIter[j]];
            tableIter[i]=temp[1];
            tableIter[j]=temp[0];
            }
        }
    }
    for (var i = 0; i < tableIter.length-1; i++){ // ha azonos a pontszám, akkor gólkülönbség alapján is rendez az alábbi cikluspár
        for (var j = i + 1; j < tableIter.length; j++){
            if (tableIter[j].points == tableIter[i].points && (tableIter[j].scored - tableIter[j].conceded) > (tableIter[i].scored - tableIter[j].conceded)){
            var temp2 = [tableIter[i], tableIter[j]];
            tableIter[i]=temp2[1];
            tableIter[j]=temp2[0];
            }
        }
    }
    return tableIter; // végül visszaadjuk az aktuális forduló után a sorba rendezett állást
}

function showTable(tableIter){  // az aktuális forduló utáni sorba rendezett állást megjelenitjük html-ben.
    for (i=0; i<tableIter.length; i++){
        nodeStanding.innerHTML += '<tr>' + 
                                    '<td>' + (i + 1) + '</td>' + 
                                    '<td align="left" width="300px">' + tableIter[i].nev1 + ' & ' + tableIter[i].nev2 +' </td>' +
                                    '<td>' + (tableIter[i].won + tableIter[i].draw + tableIter[i].lost) + '</td>' + 
                                    '<td> ' + tableIter[i].won + ' </td>' + 
                                    '<td> ' + tableIter[i].draw +' </td>' +
                                    '<td> ' + tableIter[i].lost +' </td>' +
                                    '<td> ' + tableIter[i].scored +' </td>' +
                                    '<td> ' + tableIter[i].conceded +' </td>' +
                                    '<td> ' + (tableIter[i].scored - tableIter[i].conceded) +' </td>' +
                                    '<td> ' + tableIter[i].points +' </td>' +
                                  '</tr>'
    }
}