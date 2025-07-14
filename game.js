/*
  امپراطوری من ۲۰۲۷ - نسخه وب ساده
  نویسنده: o3 AI
*/

class Country {
  constructor(name) {
    this.name = name;
    this.money = 500;
    this.army = 80;
    this.tech = 50;
    this.pop = 70; // محبوبیت
    this.alive = true;
  }

  summary() {
    return `
وضعیت ${this.name}: پول: ${this.money} | ارتش: ${this.army} | فناوری: ${this.tech} | محبوبیت: ${this.pop}`;
  }
}

class Game {
  constructor(playerCountry) {
    this.turn = 1;
    this.player = new Country(playerCountry);
    this.enemy = new Country("دشمن فرضی");
    this.logEl = document.getElementById("log");
    this.statusEl = document.getElementById("status");
    this.updateStatus();
    this.writeLog("بازی آغاز شد!");
  }

  writeLog(msg) {
    const p = document.createElement("p");
    p.textContent = msg;
    this.logEl.prepend(p);
  }

  randomEvent() {
    const events = [
      { msg: "زلزله رخ داد!", money: -70, tech: 0, pop: -10 },
      { msg: "کمک بین المللی دریافت کردید.", money: +120, tech: 0, pop: +5 },
      { msg: "نخبه ها مهاجرت کردند!", money: 0, tech: -10, pop: -5 },
      { msg: "پیشرفت موشکی موفق!", money: 0, tech: +15, pop: +10 },
    ];
    const e = events[Math.floor(Math.random() * events.length)];
    this.player.money += e.money;
    this.player.tech += e.tech;
    this.player.pop += e.pop;
    this.writeLog(`[رویداد] ${e.msg}`);
  }

  updateStatus() {
    this.statusEl.textContent = `${this.player.summary()} \nنوبت: ${this.turn}`;
  }

  doAction(action) {
    switch (action) {
      case "invest":
        if (this.player.money >= 50) {
          this.player.money -= 50;
          this.player.money += 100;
          this.writeLog("سرمایه گذاری انجام شد.");
        } else this.writeLog("پول کافی نیست!");
        break;
      case "tech":
        if (this.player.money >= 70) {
          this.player.money -= 70;
          this.player.tech += 15;
          this.writeLog("فناوری ارتقا یافت.");
        } else this.writeLog("پول کافی نیست!");
        break;
      case "army":
        if (this.player.money >= 80) {
          this.player.money -= 80;
          this.player.army += 20;
          this.writeLog("ارتش تقویت شد.");
        } else this.writeLog("پول کافی نیست!");
        break;
      case "attack":
        this.battle(this.player, this.enemy);
        break;
      case "endTurn":
        this.endTurn();
        return; // status will update inside endTurn
      default:
        break;
    }
    this.updateStatus();
  }

  battle(attacker, defender) {
    const atkScore = attacker.army + attacker.tech * (0.8 + Math.random() * 0.4);
    const defScore = defender.army + defender.tech * (0.8 + Math.random() * 0.4);
    if (atkScore > defScore) {
      const gain = 80 + Math.floor(Math.random() * 70);
      attacker.money += gain;
      defender.pop -= 15;
      this.writeLog(`${attacker.name} پیروز شد و ${gain} پول غنیمت گرفت.`);
      if (defender.pop <= 0) {
        defender.alive = false;
        this.writeLog(`${defender.name} سقوط کرد!`);
      }
    } else {
      const loss = 40 + Math.floor(Math.random() * 60);
      attacker.money -= loss;
      attacker.pop -= 10;
      this.writeLog(`${attacker.name} شکست خورد و ${loss} پول از دست داد.`);
    }
  }

  enemyMove() {
    this.enemy.army += 10;
    this.enemy.money += 50;
    if (Math.random() < 0.2) {
      this.battle(this.enemy, this.player);
    }
  }

  endTurn() {
    this.turn += 1;
    this.randomEvent();
    this.enemyMove();
    this.updateStatus();
    this.checkEnd();
  }

  checkEnd() {
    if (!this.player.alive || this.player.pop <= 0) {
      alert("شما شکست خوردید!");
      location.reload();
    }
    if (!this.enemy.alive) {
      alert("تبریک! شما پیروز شدید.");
      location.reload();
    }
  }
}

// ---- UI Logic ----
const countryList = ["ایران", "ترکیه", "عربستان", "مصر", "پاکستان"];
const optionsEl = document.getElementById("country-options");
const startBtn = document.getElementById("start-btn");
let selectedCountry = null;

countryList.forEach((c) => {
  const div = document.createElement("div");
  div.className = "country-card";
  div.textContent = c;
  div.onclick = () => {
    document.querySelectorAll(".country-card").forEach((el) => el.classList.remove("selected"));
    div.classList.add("selected");
    selectedCountry = c;
    startBtn.disabled = false;
  };
  optionsEl.appendChild(div);
});

let game = null;
startBtn.onclick = () => {
  if (!selectedCountry) return;
  document.getElementById("choose-country").classList.remove("active");
  document.getElementById("game-screen").classList.add("active");
  game = new Game(selectedCountry);
};

// action buttons
const actionsDiv = document.getElementById("actions");
actionsDiv.addEventListener("click", (e) => {
  if (!game) return;
  const btn = e.target.closest("button");
  if (btn) {
    const action = btn.getAttribute("data-action");
    game.doAction(action);
  }
});