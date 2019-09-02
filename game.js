var money = new Decimal(1);
var costMultiplier = []
var lastUpdate = new Decimal(Date.now())
const maxGenerators = 16
var gens = []
var infin = new Decimal(2).pow(1024)
var infinities = 0
var auto = false
var tick = {
  tickspeed: new Decimal(1),
  tickspeedMultiplier: new Decimal(0.95),
  cost: new Decimal(1000)
}
var gal = {
  galaxies: 0,
  cost: new Decimal(14),
  power: new Decimal(1),
  powerMult: new Decimal(1.3)
}

function format(number) {
  let n = new Decimal(number)
  let e = Math.floor(n.log10())
  let m = n.div(new Decimal(10).pow(e))
  if ((e >= 3 || e <= -2) && n.gt(new Decimal(0))) {
    return m.toFixed(2) + "e" + e
  } else {
    return number.toFixed(2)
  }
}

function buyTickspeed() {
  if (money.gte(tick.cost)) {
    money = money.sub(tick.cost)
    tick.cost = tick.cost.mul(new Decimal(10))
    tick.tickspeed = tick.tickspeed.mul(tick.tickspeedMultiplier.div(gal.power))
  }
}

function maxTickSpeed() {
  while (money.gte(tick.cost)) {
    buyTickspeed()
  }
}

function galaxyReset() {
  if (gens[15].amount.gte(gal.cost)) {
    money = new Decimal(10)
    tick.tickspeed = new Decimal(1)
    tick.cost = new Decimal(1000)
    for (let i = 0; i < maxGenerators; i++) {
      let d = new Decimal(i)
      gens[i].cost = new Decimal(10).pow(d.pow(new Decimal(2)))
      gens[i].bought = 0
      gens[i].amount = new Decimal(0)
      gens[i].mult = new Decimal(1)
    }
    gal.galaxies++
    gal.power = gal.powerMult.pow(gal.galaxies)
  }
}

function infinityReset() {
  money = new Decimal(10)
  tick.tickspeed = new Decimal(1)
  tick.cost = new Decimal(1000)
  for (let i = 0; i < maxGenerators; i++) {
    let d = new Decimal(i)
    gens[i].cost = new Decimal(10).pow(d.pow(new Decimal(2)))
    gens[i].bought = 0
    gens[i].amount = new Decimal(0)
    gens[i].mult = new Decimal(1)
  }
  infinities += infin.log10() / new Decimal(2).pow(1024).log10()
  infin = new Decimal(2).pow(1024+(infinities*256))
}

function buyGens(i) {
  if (money.gte(gens[i-1].cost)) {
    money = money.sub(gens[i-1].cost)
    gens[i-1].cost = gens[i-1].cost.mul(costMultiplier[i-1])
    gens[i-1].bought++
    gens[i-1].amount = gens[i-1].amount.add(new Decimal(1))
    gens[i-1].mult = gens[i-1].mult.mul(new Decimal(1.1))
  }
}

for (let i = 0; i < maxGenerators; i++) {
  let d = new Decimal(i)
  let aGen = {
    cost : new Decimal(10).pow(d.pow(new Decimal(2))),
    bought: 0,
    amount: new Decimal(0),
    mult: new Decimal(1)
  }
  gens.push(aGen)
  costMultiplier.push(new Decimal(2))
}

function maxAllGenerator(i) {
  while (money.gte(gens[i-1].cost)) {
    buyGens(i)
  }
}

function maxAll(m) {
  if (m === 0) {
    maxTickSpeed()
    for (let i = 1; i <= maxGenerators; i++) {
      maxAllGenerator(i)
    }
  } else if (m === 1) {
    for (let i = maxGenerators; i >= 1; i--) {
      maxAllGenerator(i)
    }
    maxTickSpeed()
  }
}


function updateGUI() {
  document.getElementById("money").textContent = "Money = " + format(money);
  document.getElementById("infinity").textContent = "Infinity = " + format(infin);
  document.getElementById("tickspeed").innerHTML = "Decrease tickspeed by " + tick.tickspeedMultiplier.toFixed(1) + "x" + format(new Decimal(1).div(gal.power))  + "<br>Tickspeed : " + format(tick.tickspeed) + "<br>Cost : " + format(tick.cost);
  document.getElementById("the16thdimensiontickspeed").innerHTML = "Make a 16th dimension galaxy<br>There are currently " + gal.galaxies + " 16th dimension galaxies<br>They are boosting the effect of tickspeed by " + format(gal.power) + " x<br>Sacrifice requirement: " + gal.cost + " 16th dimensions"
  for (let i = 0; i < maxGenerators; i++) {
    let g = gens[i];
    document.getElementById("g" + (i + 1)).innerHTML = "Generator " + (i+1) + "<br>Amount : " + format(g.amount) + "<br>bought: " + g.bought + "<br>mult: " + format(g.mult) + "x<br>cost: " + format(g.cost)
  }
}

function productionLoop(diff) {
  let ddiff = new Decimal(diff)
  money = money.add(gens[0].amount.mul(gens[0].mult.mul(ddiff.div(tick.tickspeed))));
  for(let i = 1; i < maxGenerators; i++) {
    gens[i - 1].amount = gens[i-1].amount.add(gens[i].amount.mul(gens[i].mult.mul(diff.div(tick.tickspeed))))
  }
}
function mainLoop() {
  if (auto) {
    maxAll(0)
  }
  if (money.gte(infin)) {
    infinityReset()
    if (infinities >= 1) {
      document.getElementById("infinities").innerHTML = "Infinties : " + infinities
    }
  }
  for (let i = 0; i < maxGenerators; i++) {
    let b = new Decimal(gens[i].bought)
    let ba = b.div(20).sub(new Decimal(0.4))
    costMultiplier[i] = Decimal.max(ba, 2)
  }
  tick.tickspeedMultiplier = new Decimal(0.95).pow(infinities+1)
  var dte = new Decimal(Date.now())
  var diff = dte.minus(lastUpdate).div(new Decimal(1000));
  productionLoop(diff);
  updateGUI();
  lastUpdate = new Decimal(Date.now())
}

setInterval(mainLoop, 50);

updateGUI()
