var money = new Decimal(10)
loopInfinity = -1

function getMoney() {
  money = money.add(1)
  document.getElementById(“clicks”).textContent = “Money : ” + money
}

var gens = []

for(let i = 0; i < 4; i++) {
  let aGen = {
    cost: new Decimal(10).pow(3 * i * i)
    bought: 0
    amount: 0
    mult: 1
  }
  gens.push(aGen)
}
