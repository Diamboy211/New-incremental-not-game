import Math
var money = 10
var lastUpdate = Date.now()

function getMoney() {
  money = money + 1;
  document.getElementById(“money”).textContent = “Money : ” + money
}

var gens = []

for(let i = 0; i < 4; i++) {
  let aGen = {
    cost: Math.pow(10, Math.pow(i, 2));
    bought: 0;
    amount: 0;
    mult: 1
  }
  gens.push(aGen)
}

function updateGUI() {
  document.getElementById(“money”).textContent = “money = ” + money;
  for(let i = 0; i < 4; i++) {
    let g = gens[i];
    document.getElementByID(“gen” + (i + 1)).innerHTML = “Amount : ” + g.amount + “<br bought: >” + g.bought + “<br mult: >” + g.mult + “x<br>cost: ” + g.cost

function productionLoop(diff) {
  money += gens[0].amount * gens[0].mult * diff;
  for(let i = 1; i < 4; i++) {
    gens[i - 1].amount += gens[i].amount * gens[i].mult * diff
  }
}
function mainLoop() {
  var diff = Date.now() - lastUpdate / 1000;
  productionLoop(diff);
  updateGUI();
  lastUpdate = Date.now()
}

setInterval(mainLoop, 50)

updateGUI()
