const maxGenerators = 16
var player = {
money: new Decimal(1),
costScaling: {
  start: new Decimal(75),
  speed: new Decimal(2),
  speedCost: new Decimal(1e125),
  startCost: new Decimal(1e50),
  costMult: new Decimal(1e75)
},
costMultiplier: [],
lastUpdate: new Decimal(Date.now()),
gens: [],
infin: new Decimal(2).pow(1024),
infinities: 0,
auto: false,
tick: {
  tickspeed: new Decimal(1),
  tickspeedMultiplier: new Decimal(0.95),
  cost: new Decimal(1000)
}
}

function decimalfy() {
    player.money = new Decimal(player.money)
    player.costScaling = {
      start: new Decimal(player.costScaling.start),
      speed: new Decimal(player.costScaling.speed),
      speedCost: new Decimal(player.costScaling.speedCost),
      startCost: new Decimal(player.costScaling.startCost),
      costMult: new Decimal(player.costScaling.costMult)
    },
    player.costMultiplier = new Decimal(player.costMultiplier)
    player.lastUpdate = new Decimal(player.lastUpdate)
    for (let i = 0; i < maxGenerators; i++) {
      player.gens[i] = {
        cost: new Decimal(player.gens[i].cost),
        bought: player.gens[i].bought,
        amount: new Decimal(player.gens[i].amount),
        mult: new Decimal(player.gens[i].mult)
      }
    }
    player.infin = new Decimal(player.infin)
    player.infinities = new Decimal(player.infinities)
    player.auto = player.auto
    player.tick = {
      tickspeed: new Decimal(player.tick.tickspeed),
      tickspeedMultiplier: new Decimal(player.tick.tickspeedMultiplier),
      cost: new Decimal(player.tick.cost)
    }
}

function save() {
  let p = JSON.stringify(player)
  localStorage.setItem("ee-game", p)
}

function load() {
  let p = JSON.parse(localStorage.getItem("ee-game"))
  if (p = null) {
    player = {
      money: new Decimal(1),
      costScaling: {
        start: new Decimal(75),
        speed: new Decimal(2),
        speedCost: new Decimal(1e125),
        startCost: new Decimal(1e50),
        costMult: new Decimal(1e75)
      },
      costMultiplier: [],
      lastUpdate: new Decimal(Date.now()),
      gens: [],
      infin: new Decimal(2).pow(1024),
      infinities: 0,
      auto: false,
      tick: {
        tickspeed: new Decimal(1),
        tickspeedMultiplier: new Decimal(0.95),
        cost: new Decimal(1000)
      }
      }
  } else {
    player = p
    decimalfy()
  }
}

function format(number) {
  let n = new Decimal(number)
  let e = Math.floor(n.log10())
  let m = n.div(new Decimal(10).pow(e))
  if ((e >= 3 || e <= -2) && n.gt(new Decimal(0))) {
    return m.toFixed(1) + "e" + e
  } else {
    return n.toFixed(1)
  }
}

function buyTickspeed() {
  if (player.money.gte(player.tick.cost)) {
    player.money = player.money.sub(player.tick.cost)
    player.tick.cost = player.tick.cost.mul(new Decimal(10))
    player.tick.tickspeed = player.tick.tickspeed.mul(player.tick.tickspeedMultiplier)
  }
}

function maxTickSpeed() {
  while (player.money.gte(player.tick.cost)) {
    buyTickspeed()
  }
}

function infinityReset() {
  player.money = new Decimal(10)
  player.tick.tickspeed = new Decimal(1)
  player.tick.cost = new Decimal(1000)
  player.costScaling.speed = player.costScaling.speed.mul(4)
  player.costScaling.start = player.costScaling.start.sub(80)
  player.costScaling.speedCost = new Decimal(1e125)
  player.costScaling.startCost = new Decimal(1e50)
  for (let i = 0; i < maxGenerators; i++) {
    let d = new Decimal(i)
    player.gens[i].cost = new Decimal(10).pow(d.pow(new Decimal(2)))
    player.gens[i].bought = 0
    player.gens[i].amount = new Decimal(0)
    player.gens[i].mult = new Decimal(1)
  }
  player.infinities += Math.floor(Math.max(Math.pow(player.infin.log10() / new Decimal(2).pow(1024).log10(), 0.5), 1))
  player.infin = new Decimal(2).pow(1024+(player.infinities*256))
}

function buyGens(i) {
  if (player.money.gte(player.gens[i-1].cost)) {
    player.money = player.money.sub(player.gens[i-1].cost)
    player.gens[i-1].cost = player.gens[i-1].cost.mul(player.costMultiplier[i-1])
    player.gens[i-1].bought++
    player.gens[i-1].amount = player.gens[i-1].amount.add(new Decimal(1))
    player.gens[i-1].mult = player.gens[i-1].mult.mul(new Decimal(1.1))
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
  player.gens.push(aGen)
  player.costMultiplier.push(new Decimal(2))
}

function maxAllGenerator(i) {
  while (player.money.gte(player.gens[i-1].cost)) {
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

function costMultUpdate() {
    document.getElementById("a").textContent = format(player.costMultiplier[0]) + ", " + format(player.costMultiplier[1]) + ", " + format(player.costMultiplier[2]) + ", " + format(player.costMultiplier[3]) + ", " + format(player.costMultiplier[4]) + ", " + format(player.costMultiplier[5]) + ", " + format(player.costMultiplier[6]) + ", " + format(player.costMultiplier[7]) + ", " + format(player.costMultiplier[8]) + ", " + format(player.costMultiplier[9]) + ", " + format(player.costMultiplier[10]) + ", " + format(player.costMultiplier[11]) + ", " + format(player.costMultiplier[12]) + ", " + format(player.costMultiplier[13]) + ", " + format(player.costMultiplier[14]) + ", " + format(player.costMultiplier[15])
}

function buyCostScalingUpgrade(m) {
  //0 = speed 1 = start
  if (m === 0) {
    if (player.money.gte(player.costScaling.speedCost)) {
      player.money = player.money.sub(player.costScaling.speedCost)
      player.costScaling.speed = player.costScaling.speed.mul(2)
      player.costScaling.speedCost = player.costScaling.speedCost.mul(player.costScaling.costMult)
    }
  } else {
    if (player.money.gte(player.costScaling.startCost)) {
      player.money = player.money.sub(player.costScaling.startCost)
      player.costScaling.start = player.costScaling.start.add(new Decimal(40))
      player.costScaling.startCost = player.costScaling.startCost.mul(player.costScaling.costMult)
    }
  }
}

function updateGUI() {
  costMultUpdate()
  document.getElementById("buycostscalingspeed").innerHTML = "Cost scales by 1 per " + format(player.costScaling.speed) + " bought<br>" + "Cost: " + format(player.costScaling.speedCost)
  document.getElementById("buycostscalingstart").innerHTML = "Cost scaling starts at: " + format(player.costScaling.start) + " bought generator<br>" + "Cost: " + format(player.costScaling.startCost)
  document.getElementById("money").textContent = "Money = " + format(player.money);
  document.getElementById("infinity").textContent = "Infinity = " + format(player.infino);
  for (let i = 0; i < maxGenerators; i++) {
    let g = player.gens[i];
    document.getElementById("tickspeed").innerHTML = "Decrease tickspeed by " + format(player.tick.tickspeedMultiplier) + "<br>Tickspeed : " + format(player.tick.tickspeed) + "<br>Cost : " + format(player.tick.cost)
    document.getElementById("g" + (i + 1)).innerHTML = "Generator " + (i+1) + "<br>Amount : " + format(g.amount) + "<br>bought: " + g.bought + "<br>mult: " + format(g.mult) + "x<br>cost: " + format(g.cost)
  }
}

function productionLoop(diff) {
  let ddiff = new Decimal(diff)
  player.money = player.money.add(player.gens[0].amount.mul(player.gens[0].mult.mul(ddiff.div(player.tick.tickspeed))));
  for(let i = 1; i < maxGenerators; i++) {
    player.gens[i - 1].amount = player.gens[i-1].amount.add(player.gens[i].amount.mul(player.gens[i].mult.mul(diff.div(player.tick.tickspeed))))
  }
}
function mainLoop() {
  if (player.auto) {
    maxAll(0)
  }
  if (player.money.gte(player.infin)) {
    infinityReset()
    if (player.infinities >= 1) {
      document.getElementById("infinities").innerHTML = "Infinties : " + player.infinities
    }
  }
  for (let i = 0; i < maxGenerators; i++) {
    let b = new Decimal(player.gens[i].bought)
    let ba = b.mul(player.costScaling.speed).sub(player.costScaling.start.mul(player.costScaling.speed))
    player.costMultiplier[i] = Decimal.max(ba, 2)
  }
  player.tick.tickspeedMultiplier = new Decimal(0.99).pow(player.infinities+1)
  var dte = new Decimal(Date.now())
  var diff = dte.minus(player.lastUpdate).div(new Decimal(1000));
  productionLoop(diff);
  updateGUI();
  player.lastUpdate = new Decimal(Date.now())
}

load()
setInterval(save, 5000)
setInterval(mainLoop, 50);

updateGUI()
