"""Drive the autonomous market through real browser input.

This probe never creates offers, moves characters, grants money or changes saves
through JavaScript. JavaScript evaluations read diagnostics and DOM only. Run on
an executor allowing Chromium sockets; passing syntax checks are not a playtest.
"""

import argparse
import hashlib
import json
import math
import os
import time
import traceback
from pathlib import Path


def arguments():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--entry-file", default="dist/TOGO_LIFE_MONTAGNE.html")
    parser.add_argument("--url", help="Use an actual HTTP(S) deployment instead of the built monofile")
    parser.add_argument("--output-dir", default="artifacts/society")
    parser.add_argument("--client-timeout", type=float, default=90)
    return parser.parse_args()


class Probe:
    def __init__(self, output, page, report):
        self.output, self.page, self.report = output, page, report
        self.started = time.monotonic()

    def checkpoint(self, stage):
        self.report["stage"] = stage
        self.report["elapsedSeconds"] = round(time.monotonic() - self.started, 3)
        (self.output / "society-results.json").write_text(
            json.dumps(self.report, indent=2, ensure_ascii=False)
        )
        print("SOCIETY_STAGE", stage, flush=True)

    def check(self, name, condition, evidence=None):
        result = {"name": name, "pass": bool(condition)}
        if evidence is not None:
            result["evidence"] = evidence
        self.report["checks"].append(result)
        self.checkpoint(name)
        if not condition:
            raise AssertionError(name)

    def state(self):
        return self.page.evaluate("window.__THREE_GAME_DIAGNOSTICS__.state")

    def snapshot(self, stage):
        value = self.state()
        self.report["snapshots"].append({"stage": stage, "state": value})
        self.checkpoint(stage)
        return value

    def release_keys(self):
        for key in ("w", "a", "s", "d", "Shift"):
            self.page.keyboard.up(key)

    def walk_to(self, x, z, timeout=45):
        """Walk existing sidewalks; keyboard axes follow the real camera yaw."""
        before = self.state()["player"]
        deadline = time.monotonic() + timeout
        previous = before
        progressed_at = time.monotonic()
        travelled = 0
        self.checkpoint(f"walk to {x}, {z}")
        try:
            while time.monotonic() < deadline:
                sample = self.state()
                position = sample["player"]
                travelled += distance(previous, position)
                if distance(previous, position) > 0.04:
                    progressed_at = time.monotonic()
                previous = position
                dx, dz = x - position["x"], z - position["z"]
                remaining = math.hypot(dx, dz)
                if remaining < 0.55:
                    break
                if time.monotonic() - progressed_at > 7:
                    raise AssertionError("Real keyboard route stopped progressing")
                yaw = sample["camera"]["yaw"]
                ix = dx * math.cos(yaw) - dz * math.sin(yaw)
                iz = dx * math.sin(yaw) + dz * math.cos(yaw)
                chosen = set()
                if abs(ix) > 0.20 * remaining:
                    chosen.add("d" if ix > 0 else "a")
                if abs(iz) > 0.20 * remaining:
                    chosen.add("s" if iz > 0 else "w")
                if remaining > 2.5:
                    chosen.add("Shift")
                for key in ("w", "a", "s", "d", "Shift"):
                    if key in chosen:
                        self.page.keyboard.down(key)
                    else:
                        self.page.keyboard.up(key)
                self.page.wait_for_timeout(140)
            else:
                raise AssertionError("Real keyboard route timed out")
        finally:
            self.release_keys()
        self.page.wait_for_timeout(400)
        after = self.state()["player"]
        result = {"target": {"x": x, "z": z}, "before": before, "after": after,
                  "distanceTravelledMetres": round(travelled, 4)}
        self.report["routes"].append(result)
        self.check("real keyboard reaches waypoint", distance(after, {"x": x, "z": z}) < 1, result)
        return after

    def open_action(self, label):
        self.page.keyboard.press("e")
        self.page.wait_for_selector("#action[open]", timeout=15000)
        title = self.page.locator("#actionTitle").inner_text()
        self.check("contextual interaction is at " + label, label.lower() in title.lower(),
                   {"title": title, "player": self.state()["player"]})

    def click_action(self, action, *, quantity=None, price=None):
        selector = f'#choices button[data-action="{action}"]'
        if quantity is not None:
            selector += f'[data-quantity="{quantity}"]'
        if price is not None:
            selector += f'[data-price="{price}"]'
        choice = self.page.locator(selector)
        evidence = {"selector": selector, "buttons": self.page.locator("#choices button").evaluate_all(
            "bs => bs.map(b => ({text:b.innerText,disabled:b.disabled,data:{...b.dataset}}))"
        )}
        self.check("normal action is available: " + selector,
                   choice.count() == 1 and choice.is_enabled(), evidence)
        choice.click()

    def close_action(self):
        if self.page.locator("#action").evaluate("dialog => dialog.open"):
            self.page.locator('#action [data-close="action"]').first.click()

    def wait_state(self, name, predicate, timeout):
        """Observe only; time, need decay, routing and transactions remain real."""
        self.checkpoint("wait " + name)
        deadline = time.monotonic() + timeout
        last = None
        while time.monotonic() < deadline:
            last = self.state()
            if predicate(last):
                self.report["snapshots"].append({"stage": name, "state": last})
                return last
            self.page.wait_for_timeout(250)
        self.report["snapshots"].append({"stage": "timeout " + name, "state": last})
        raise AssertionError("Autonomous observation timed out: " + name)

    def capture(self, filename):
        self.checkpoint("capture " + filename)
        self.page.screenshot(path=str(self.output / filename), timeout=30000)
        self.report["captures"].append(filename)
        self.checkpoint("captured " + filename)


def distance(a, b):
    return math.hypot(a["x"] - b["x"], a["z"] - b["z"])


def society(state):
    # Both are read-only representations of the same serialized simulation.
    value = state.get("society", state.get("simulation", {}).get("society"))
    if not isinstance(value, dict):
        raise AssertionError("Read-only autonomous society snapshot missing")
    return value


def actor(state, identity):
    return next(a for a in society(state)["agents"] if a["id"] == identity)


def trades(state, venue=None):
    return [t for t in society(state)["trades"] if venue is None or t["venue"] == venue]


def latest_new_trade(state, prior_ids, venue):
    return next((t for t in reversed(trades(state, venue)) if t["id"] not in prior_ids), None)


def assert_purchase(probe, before, after, quantity, price):
    b, a = before["simulation"], after["simulation"]
    sb, sa = society(before)["supplier"], society(after)["supplier"]
    total = quantity * price
    probe.check("supplier purchase debits exact accepted amount", b["money"] - a["money"] == total,
                {"before": b["money"], "after": a["money"], "quantity": quantity, "unitPrice": price})
    probe.check("supplier purchase credits provider exactly once", sa["wallet"] - sb["wallet"] == total,
                {"before": sb["wallet"], "after": sa["wallet"]})
    probe.check("supplier purchase transfers identical product quantity",
                a["carried"] - b["carried"] == quantity and sb["stock"] - sa["stock"] == quantity,
                {"bagBefore": b["carried"], "bagAfter": a["carried"],
                 "providerStockBefore": sb["stock"], "providerStockAfter": sa["stock"]})
    new_trade = latest_new_trade(after, {t["id"] for t in trades(before)}, "market")
    probe.check("supplier transaction is recorded with actual negotiated price",
                new_trade is not None and new_trade["quantity"] == quantity
                and new_trade["unitPrice"] == price and new_trade["total"] == total,
                new_trade)


def market_scenario(probe, client_timeout):
    page = probe.page
    initial = probe.snapshot("new life")
    residents = society(initial)["agents"]
    identities = {a["id"] for a in residents}
    probe.check("eight individually identified autonomous residents",
                len(residents) == 8 and identities == {f"resident-{i}" for i in range(8)})
    probe.check("clients have their own budgets, provisions and decision memory",
                all(isinstance(a.get("wallet"), (int, float)) and a["wallet"] >= 0
                    and isinstance(a.get("inventory"), (int, float))
                    and isinstance(a.get("memory"), dict) and isinstance(a.get("blackboard"), dict)
                    for a in residents))

    # Existing authored pedestrian routes; no coordinate setters or teleport.
    for point in ((-6, 10), (-6, 0), (-15, 0)):
        probe.walk_to(*point)
    probe.open_action("marché")
    before_reject = probe.snapshot("before insufficient offer")
    probe.click_action("negotiate", quantity=4, price=150)
    rejected = probe.snapshot("insufficient offer rejected")
    supplier = society(rejected)["supplier"]
    probe.check("supplier refuses insufficient offer",
                supplier["lastDecision"]["kind"] == "rejected", supplier["lastDecision"])
    probe.check("rejected offer cannot move funds or goods",
                rejected["simulation"]["money"] == before_reject["simulation"]["money"]
                and rejected["simulation"]["carried"] == before_reject["simulation"]["carried"]
                and supplier["wallet"] == society(before_reject)["supplier"]["wallet"]
                and supplier["stock"] == society(before_reject)["supplier"]["stock"])
    probe.check("supplier remembers refusal through changed trust",
                supplier["trust"] < society(before_reject)["supplier"]["trust"],
                {"before": society(before_reject)["supplier"]["trust"], "after": supplier["trust"]})

    probe.close_action()
    probe.open_action("marché")
    probe.click_action("negotiate", quantity=4, price=300)
    counter = probe.snapshot("counteroffer proposed")
    supplier = society(counter)["supplier"]
    quote = supplier["quote"]
    probe.check("supplier creates a binding counteroffer",
                supplier["lastDecision"]["kind"] == "counter" and isinstance(quote, dict)
                and quote["quantity"] == 4 and 300 < quote["unitPrice"] < 350,
                {"decision": supplier["lastDecision"], "quote": quote})
    probe.close_action()
    probe.open_action("marché")
    probe.check("accepted counterprice is visible in normal dialogue",
                str(quote["unitPrice"]) in page.locator("#action").inner_text(),
                {"unitPrice": quote["unitPrice"], "dialogue": page.locator("#action").inner_text()})
    probe.capture("market-counteroffer.png")
    before_purchase = probe.snapshot("before counteroffer purchase")
    probe.click_action("buy", quantity=4)
    purchased = probe.snapshot("counteroffer purchased")
    assert_purchase(probe, before_purchase, purchased, 4, quote["unitPrice"])

    # Second genuinely different negotiation: an acceptable bulk proposal.
    probe.open_action("marché")
    probe.click_action("negotiate", quantity=8, price=315)
    accepted = probe.snapshot("bulk offer accepted")
    supplier = society(accepted)["supplier"]
    probe.check("acceptable bulk offer is accepted without invented discount",
                supplier["lastDecision"]["kind"] == "accepted"
                and supplier["quote"] is not None and supplier["quote"]["quantity"] == 8
                and supplier["quote"]["unitPrice"] == 315, supplier)
    probe.close_action()
    probe.open_action("marché")
    before_purchase = probe.snapshot("before accepted bulk purchase")
    probe.click_action("buy", quantity=8)
    purchased = probe.snapshot("accepted bulk purchased")
    assert_purchase(probe, before_purchase, purchased, 8, 315)

    for point in ((-7, 0), (-7, 25), (-13, 25)):
        probe.walk_to(*point)
    probe.open_action("comptoir")
    before_invest = probe.snapshot("before physical business opening")
    probe.click_action("invest")
    invested = probe.snapshot("business opened on site")
    probe.check("physical business investment has explicit cost",
                invested["simulation"]["biz"] and before_invest["simulation"]["money"]
                - invested["simulation"]["money"] == 9000)
    probe.open_action("comptoir")
    before_delivery = probe.snapshot("before physical stock delivery")
    probe.click_action("deposit")
    delivered = probe.snapshot("stock delivered on site")
    old_trade_ids = {t["id"] for t in trades(before_delivery)}
    concurrent_sales = [t for t in trades(delivered, "kiosk") if t["id"] not in old_trade_ids]
    probe.check("delivery transfers stock rather than manufacturing goods",
                delivered["simulation"]["carried"] == 0
                and delivered["simulation"]["stock"] - before_delivery["simulation"]["stock"]
                + sum(t["quantity"] for t in concurrent_sales) == before_delivery["simulation"]["carried"]
                and delivered["simulation"]["money"] - before_delivery["simulation"]["money"]
                == sum(t["total"] for t in concurrent_sales),
                {"before": before_delivery["simulation"], "after": delivered["simulation"],
                 "salesCompletedBetweenClicks": concurrent_sales})
    probe.open_action("comptoir")
    probe.click_action("price", price=450)
    accessible = probe.snapshot("accessible retail price")
    probe.check("retail price changes only through the on-site action", accessible["simulation"]["price"] == 450)
    prior_ids = {t["id"] for t in trades(accessible)}
    sold = probe.wait_state("client arrives and buys at the kiosk",
                            lambda s: latest_new_trade(s, prior_ids, "kiosk") is not None, client_timeout)
    retail = latest_new_trade(sold, prior_ids, "kiosk")
    buyer = actor(sold, retail["actorId"])
    before_buyer = actor(accessible, retail["actorId"])
    probe.check("sale debits the real client's own budget",
                retail["actorWalletBefore"] - retail["actorWalletAfter"] == retail["total"]
                and retail["unitPrice"] == 450 and retail["total"] == retail["quantity"] * 450, retail)
    probe.check("sale credits player and consumes matching stock",
                retail["playerMoneyAfter"] - retail["playerMoneyBefore"] == retail["total"]
                and retail["stockBefore"] - retail["stockAfter"] == retail["quantity"], retail)
    probe.check("client physically reaches the counter before trade",
                distance({"x": retail["actorX"], "z": retail["actorZ"]}, {"x": -13, "z": 25}) <= 0.6
                and distance(buyer, {"x": -13, "z": 25}) <= 3.5,
                {"actor": buyer, "trade": retail, "venue": {"x": -13, "z": 25}})
    probe.check("purchase improves client's provisions and remembered purchases",
                buyer["memory"]["purchases"] > before_buyer["memory"]["purchases"]
                and buyer["inventory"] >= retail["quantity"],
                {"before": before_buyer, "after": buyer})
    # Open a normal contextual menu before a potentially slow screenshot.
    # This preserves the observed 450 F state without freezing through a hook.
    probe.open_action("comptoir")
    probe.capture("autonomous-kiosk-sale.png")
    probe.click_action("price", price=1100)
    expensive = probe.snapshot("high price offered")
    probe.check("player's high price is genuinely applied", expensive["simulation"]["price"] == 1100)
    prior_ids = {t["id"] for t in trades(expensive)}
    competitor_state = probe.wait_state("price refusal leads to competing trader purchase",
        lambda s: any(t["id"] not in prior_ids and actor(s, t["actorId"])["memory"].get("refusedPrice") == 1100
                      for t in trades(s, "competitor")), client_timeout)
    rival_trade = next(t for t in reversed(trades(competitor_state, "competitor"))
                       if t["id"] not in prior_ids and actor(competitor_state, t["actorId"])["memory"].get("refusedPrice") == 1100)
    rival_buyer = actor(competitor_state, rival_trade["actorId"])
    probe.check("overpriced offer is refused by an identified client",
                rival_buyer["memory"]["refusedPrice"] == 1100
                and rival_buyer["maxPrice"] < 1100, rival_buyer)
    probe.check("competition is an actual paid product transfer",
                rival_trade["total"] > 0 and rival_trade["actorWalletBefore"] - rival_trade["actorWalletAfter"] == rival_trade["total"]
                and rival_trade["stockBefore"] - rival_trade["stockAfter"] == rival_trade["quantity"], rival_trade)
    probe.check("competing buyer physically reaches the other market stall",
                distance({"x": rival_trade["actorX"], "z": rival_trade["actorZ"]}, {"x": -15, "z": 0}) <= 0.6,
                {"trade": rival_trade, "venue": {"x": -15, "z": 0}})
    probe.check("competitor sale cannot secretly credit the player",
                rival_trade["playerMoneyBefore"] == rival_trade["playerMoneyAfter"], rival_trade)
    page.locator("#businessBtn").click()
    page.wait_for_selector("#life[open]")
    probe.capture("autonomous-price-refusal.png")
    page.locator('#life [data-close="life"]').first.click()

    # Pause performs the game's normal save before opening its menu.
    page.locator("#pauseBtn").click()
    page.wait_for_selector("#pause[open]")
    saved_state = probe.snapshot("saved through normal pause menu")
    stored = page.evaluate("JSON.parse(localStorage.getItem('togo-life:montagne:v2'))")
    probe.check("normal menu really persists the autonomous society",
                isinstance(stored, dict) and isinstance(stored.get("society"), dict)
                and stored["society"]["supplier"]["trust"] == society(saved_state)["supplier"]["trust"])
    page.reload(wait_until="domcontentloaded", timeout=30000)
    page.wait_for_selector("#start[open]", timeout=30000)
    probe.check("continue is offered from the actual stored save", page.locator("#continueBtn").is_visible())
    page.locator("#continueBtn").click()
    page.wait_for_selector("#start[open]", state="hidden", timeout=30000)
    page.locator("#pauseBtn").click()
    page.wait_for_selector("#pause[open]")
    restored = probe.snapshot("saved autonomous society restored")
    expected, actual = stored["society"], society(restored)
    probe.check("supplier trust and negotiation decision survive reload",
                actual["supplier"]["trust"] == expected["supplier"]["trust"]
                and actual["supplier"]["lastDecision"] == expected["supplier"]["lastDecision"])
    expected_agents = {a["id"]: a for a in expected["agents"]}
    probe.check("individual relationships survive reload",
                all(a["relationship"] == expected_agents[a["id"]]["relationship"] for a in actual["agents"]))
    durable_memory = ("purchases", "lastPurchaseTick", "refusedPrice", "lastWorkDay")
    probe.check("client refusal and purchase memories survive reload",
                all(all(a["memory"][key] == expected_agents[a["id"]]["memory"][key]
                        for key in durable_memory) for a in actual["agents"]),
                {"comparedFields": durable_memory,
                 "method": "Visit/decision timestamps may advance during the real unpaused interval before the normal menu opens."})
    settled_workers = [a for a in expected["agents"] if a["role"] == "client"
                       and a["blackboard"]["goal"] == "work" and a["state"] == "work"]
    probe.check("a settled resident retains their actual remembered decision",
                bool(settled_workers) and any(
                    actor(restored, a["id"])["blackboard"]["goal"] == a["blackboard"]["goal"]
                    and all(actor(restored, a["id"])["memory"][key] == a["memory"][key]
                            for key in ("lastChoice", "lastReason", "lastPrice"))
                    for a in settled_workers),
                {"residentIds": [a["id"] for a in settled_workers]})
    probe.check("recorded transaction history survives reload", actual["trades"] == expected["trades"])
    probe.check("business ownership and inventory survive reload",
                restored["simulation"]["biz"] == stored["biz"]
                and restored["simulation"]["stock"] == stored["stock"])
    page.get_by_role("button", name="Reprendre", exact=True).click()
    page.wait_for_timeout(700)
    probe.check("resumed autonomous world is active before final capture",
                page.evaluate("!document.querySelector('dialog[open]')"))
    probe.capture("autonomous-market-active.png")
    probe.snapshot("final active world")


def main():
    args = arguments()
    output = Path(args.output_dir).resolve()
    output.mkdir(parents=True, exist_ok=True)
    entry = Path(args.entry_file).resolve()
    report = {"status": "running", "checks": [], "captures": [], "errors": [],
              "consoleErrors": [], "pageErrors": [], "routes": [], "snapshots": [],
              "sourceSha": os.environ.get("GITHUB_SHA"),
              "method": "Real keyboard and normal UI; read-only diagnostic observations; no state injection."}
    browser = context = probe = None
    try:
        if args.url:
            url = args.url + ("&" if "?" in args.url else "?") + "qa=1"
            report["transport"] = "actual-http"
        else:
            data = entry.read_bytes()
            report.update(transport="offline-file", entryBytes=len(data),
                          entrySha256=hashlib.sha256(data).hexdigest())
            url = entry.as_uri() + "?qa=1"
        report["entryUrl"] = url
        from playwright.sync_api import sync_playwright
        with sync_playwright() as pw:
            try:
                browser = pw.chromium.launch(headless=True, args=[
                    "--no-sandbox", "--disable-dev-shm-usage", "--use-gl=angle",
                    "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
                report["browserVersion"] = browser.version
                context = browser.new_context(viewport={"width": 1440, "height": 900})
                page = context.new_page()
                page.set_default_timeout(30000)
                page.on("pageerror", lambda error: report["pageErrors"].append(str(error)))
                page.on("console", lambda message: report["consoleErrors"].append(message.text)
                        if message.type == "error" else None)
                probe = Probe(output, page, report)
                probe.checkpoint("navigate actual game")
                page.goto(url, wait_until="domcontentloaded", timeout=30000)
                page.wait_for_selector("#start[open]", timeout=30000)
                page.wait_for_function("!!window.__THREE_GAME_DIAGNOSTICS__", timeout=30000)
                page.locator("#startBtn").click()
                page.wait_for_selector("#start[open]", state="hidden", timeout=30000)
                page.wait_for_timeout(600)
                report["gpu"] = page.evaluate("""() => {
                  const canvas=document.getElementById('world');
                  const gl=canvas.getContext('webgl2')||canvas.getContext('webgl');
                  const e=gl&&gl.getExtension('WEBGL_debug_renderer_info');
                  const renderer=e?gl.getParameter(e.UNMASKED_RENDERER_WEBGL):null;
                  return {renderer,softwareRendered:renderer?(/SwiftShader|llvmpipe|Software/i.test(renderer)):null,
                    physicalAndroidValidated:false};
                }""")
                market_scenario(probe, args.client_timeout)
                probe.check("no JavaScript page or console errors",
                            not report["pageErrors"] and not report["consoleErrors"],
                            {"page": report["pageErrors"], "console": report["consoleErrors"]})
                report["status"] = "pass"
                probe.checkpoint("completed")
            finally:
                if probe is not None:
                    try:
                        probe.release_keys()
                    except Exception:
                        pass
                if context is not None:
                    context.close()
                if browser is not None:
                    browser.close()
    except Exception as error:
        report["status"] = "failed"
        report["errors"].append(str(error))
        report["traceback"] = traceback.format_exc()
    (output / "society-results.json").write_text(json.dumps(report, indent=2, ensure_ascii=False))
    print(json.dumps({"status": report["status"], "checks": len(report["checks"]),
                      "captures": report["captures"], "errors": report["errors"]}), flush=True)
    return 0 if report["status"] == "pass" else 1


if __name__ == "__main__":
    raise SystemExit(main())
