var money = new Decimal(10)

function click() {
  money = money + 1
  document.getElementById(“clicks”).textContent = “Money : ” + money
}
