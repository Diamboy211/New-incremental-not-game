var money = 10;
var lastUpdate = Date.now()
var maxGenerators = 16

function getMoney() {
  money = money + 1;
}

var gens = []

function format(number) {
  let e = Math.floor(Math.log10(number))
  let m = number / Math.pow(10, e)
  if (e >= 3) {
    return m.toFixed(2) + "e" + e
  } else {
    return number.toFixed(2)
  }
}

function buyGens(i) {
  if (gens[i-1].cost <= money) {
    money -= gens[i-1].cost
    gens[i-1].cost *= 1.5
    gens[i-1].bought++
    gens[i-1].amount++
    gens[i-1].mult *= 1.1
  }
}

for (let i = 0; i < maxGenerators; i++) {
  let aGen = {
    cost: Math.pow(10, Math.pow(i, 2)),
    bought: 0,
    amount: 0,
    mult: 1
  }
  gens.push(aGen)
}

function maxAllGenerator(i) {
  while (money > gens[i-1].cost) {
    buyGens(i)
  }
}

function maxAll(m) {
  if (m === 0) {
    for (let i = 1; i <= maxGenerators; i++) {
      maxAllGenerator(i)
    }
  } else if (m === 1) {
    for (let i = maxGenerators; i >= 1; i--) {
      maxAllGenerator(i)
    }
  }
}


function updateGUI() {
  document.getElementById("money").textContent = "Money = " + format(money);
  for (let i = 0; i < maxGenerators; i++) {
    let g = gens[i];
    document.getElementById("g" + (i + 1)).innerHTML = "Generator " + (i+1) + "<br>Amount : " + format(g.amount) + "<br>bought: " + g.bought + "<br>mult: " + format(g.mult) + "x<br>cost: " + format(g.cost)
  }
}

function productionLoop(diff) {
  money += gens[0].amount * gens[0].mult * diff;
  for(let i = 1; i < maxGenerators; i++) {
    gens[i - 1].amount += gens[i].amount * gens[i].mult * diff
  }
}
function mainLoop() {
  var diff = (Date.now() - lastUpdate) / 1000;
  productionLoop(diff);
  updateGUI();
  lastUpdate = Date.now()
}

setInterval(mainLoop, 50);

updateGUI()
