var money = new Decimal(10)

function getMoney() {
  money = money.add(1)
  document.getElementById(“clicks”).textContent = “Money : ” + money
}
