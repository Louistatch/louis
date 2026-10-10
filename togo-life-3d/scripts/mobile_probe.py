"""Real touch-input probe of the generated game in bundled Chromium.

Run after `npm run build` and `playwright install chromium` on a compatible CI
executor. Android-shaped browser emulation is not a physical Android benchmark.
This script never writes game state or calls a teleport/debug mutation API.
"""

import hashlib
import json
import math
import os
import time
import traceback
from pathlib import Path

from playwright.sync_api import sync_playwright


GAME = Path(__file__).resolve().parents[1]
ENTRY = GAME / "dist" / "TOGO_LIFE_MONTAGNE.html"
OUTPUT = GAME / "artifacts"
OUTPUT.mkdir(exist_ok=True)
REPORT_PATH = OUTPUT / "mobile-probe.json"
STARTED = time.monotonic()
report = {
    "engine": "chromium",
    "status": "running",
    "sourceSha": os.environ.get("TOGO_SOURCE_SHA") or os.environ.get("GITHUB_SHA"),
    "entryUrl": ENTRY.as_uri() + "?qa=1",
    "transport": "offline-file",
    "emulation": {
        "portrait": {"width": 390, "height": 844},
        "landscape": {"width": 844, "height": 390},
        "deviceScaleFactor": 1.5,
        "hasTouch": True,
        "isMobile": True,
        "physicalAndroidValidated": False,
    },
    "checks": [],
    "checkpoints": [],
    "captures": [],
    "captureAttempts": [],
    "errors": [],
    "pageErrors": [],
    "consoleErrors": [],
    "browserEvents": [],
    "cameraGesture": {"status": "not_verified", "reason": "Probe has not reached this stage."},
    "performanceMethod": (
        "Game's rolling mean of up to 180 active requestAnimationFrame intervals "
        "(0 < interval < 2 seconds), read after 10 seconds with no open dialog. "
        "Bundled Chromium uses ANGLE/SwiftShader in CI; this is not a physical Android result."
    ),
}


def concise(value):
    text = str(value)
    return text if len(text) <= 2000 else text[:2000] + " [truncated]"


def checkpoint(label):
    report["stage"] = label
    report["checkpoints"].append({"stage": label, "elapsedSeconds": round(time.monotonic() - STARTED, 3)})
    REPORT_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2))
    print("MOBILE_PROBE", label, flush=True)


def check(label, condition, evidence=None):
    result = {"name": label, "pass": bool(condition)}
    if evidence is not None:
        result["evidence"] = evidence
    report["checks"].append(result)
    checkpoint(label)
    return bool(condition)


def capture(page, filename):
    # A compositor timeout must not suppress the independent touch/position checks.
    checkpoint("capture " + filename)
    attempt = {"file": filename, "timeoutMs": 30000}
    began = time.monotonic()
    try:
        page.screenshot(path=str(OUTPUT / filename), timeout=30000)
        attempt["status"] = "pass"
        report["captures"].append(filename)
    except Exception as error:
        attempt["status"] = "failed"
        attempt["error"] = concise(error)
        report["errors"].append(filename + ": " + concise(error))
    attempt["seconds"] = round(time.monotonic() - began, 3)
    report["captureAttempts"].append(attempt)
    checkpoint("capture completed " + filename)


def state(page):
    return page.evaluate("window.__THREE_GAME_DIAGNOSTICS__.state")


def distance(a, b):
    return math.hypot(a["x"] - b["x"], a["z"] - b["z"])


def no_dialog(page):
    return page.evaluate("!document.querySelector('dialog[open]')")


def control_layout(page, orientation):
    layout = page.evaluate("""() => {
      const ids = ['neighborhoodBtn', 'lifeBtn', 'businessBtn', 'pauseBtn',
        'interactBtn', 'runBtn', 'cameraBtn', 'mapBtn', 'objectiveBtn', 'joystick'];
      return ids.map(id => {
        const e = document.getElementById(id), r = e.getBoundingClientRect(), s = getComputedStyle(e);
        return {id, x:r.x, y:r.y, width:r.width, height:r.height,
          visible:r.width>0 && r.height>0 && s.display!=='none' && s.visibility!=='hidden',
          inViewport:r.left>=-1 && r.top>=-1 && r.right<=innerWidth+1 && r.bottom<=innerHeight+1};
      });
    }""")
    report.setdefault("controlLayouts", {})[orientation] = layout
    check(orientation + " commands visible and inside viewport", all(c["visible"] and c["inViewport"] for c in layout), layout)
    check(orientation + " commands have 48px touch targets", all(c["width"] >= 47.9 and c["height"] >= 47.9 for c in layout), layout)
    overflow = page.evaluate("""() => ({viewport:innerWidth,
      document:document.documentElement.scrollWidth, body:document.body.scrollWidth})""")
    check(orientation + " has no horizontal overflow", overflow["document"] <= overflow["viewport"] + 1 and overflow["body"] <= overflow["viewport"] + 1, overflow)
    separated = page.evaluate("""() => {
      const d=document.querySelector('.game-dock').getBoundingClientRect();
      return ['joystick','runBtn'].map(id=>{
        const r=document.getElementById(id).getBoundingClientRect();
        return {id,overlap:r.left<d.right&&r.right>d.left&&r.top<d.bottom&&r.bottom>d.top};
      });
    }""")
    check(orientation + " joystick and run button are separate from dock", all(not c["overlap"] for c in separated), separated)


def send_touch(cdp, kind, x=None, y=None, identifier=7):
    points = [] if kind in ("touchEnd", "touchCancel") else [{"x": x, "y": y, "id": identifier, "radiusX": 2, "radiusY": 2, "force": 1}]
    cdp.send("Input.dispatchTouchEvent", {"type": kind, "touchPoints": points})


browser = None
context = None
page = None
try:
    if not ENTRY.is_file():
        raise FileNotFoundError("Build the real game first: " + str(ENTRY))
    entry_bytes = ENTRY.read_bytes()
    report["entryBytes"] = len(entry_bytes)
    report["entrySha256"] = hashlib.sha256(entry_bytes).hexdigest()
    with sync_playwright() as pw:
        checkpoint("launch bundled Chromium")
        browser = pw.chromium.launch(headless=True, timeout=30000, args=[
            "--no-sandbox", "--disable-dev-shm-usage", "--use-gl=angle",
            "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
        ])
        report["version"] = browser.version
        browser.on("disconnected", lambda: report["browserEvents"].append("browser disconnected"))
        context = browser.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=1.5, has_touch=True, is_mobile=True)
        page = context.new_page()
        page.set_default_timeout(30000)
        page.on("pageerror", lambda error: report["pageErrors"].append(concise(error)))
        page.on("console", lambda message: report["consoleErrors"].append(concise(message.text)) if message.type == "error" else None)
        page.on("crash", lambda: report["browserEvents"].append("page crashed"))
        checkpoint("navigate real offline game in portrait")
        load_started = time.monotonic()
        page.goto(report["entryUrl"], wait_until="commit", timeout=30000)
        checkpoint("wait for real animated avatar preview")
        page.wait_for_selector("#start[open]", timeout=30000)
        page.wait_for_function("document.getElementById('previewStatus').textContent.includes('aperçu en direct')", timeout=30000)
        page.wait_for_function("!!window.__THREE_GAME_DIAGNOSTICS__", timeout=30000)
        report["onboardingSeconds"] = round(time.monotonic() - load_started, 3)
        preview = page.locator("#avatarPreview")
        preview_info = preview.evaluate("""c => ({visible:c.getBoundingClientRect().width>0&&c.getBoundingClientRect().height>0,
          width:c.width,height:c.height,hasWebGL:!!(c.getContext('webgl2')||c.getContext('webgl'))})""")
        check("portrait real WebGL avatar preview visible", preview_info["visible"] and preview_info["hasWebGL"] and preview_info["width"] > 0 and preview_info["height"] > 0, preview_info)
        capture(page, "mobile-probe-portrait-start.png")
        checkpoint("enter game through actual start button touch")
        page.locator("#startBtn").tap()
        page.wait_for_selector("#start[open]", state="hidden", timeout=30000)
        check("start touch closes onboarding", no_dialog(page))
        page.wait_for_timeout(700)
        control_layout(page, "portrait")
        capture(page, "mobile-probe-portrait-active.png")

        checkpoint("CDP touch joystick movement and cancellation")
        cdp = context.new_cdp_session(page)
        joystick = page.locator("#joystick").bounding_box()
        if joystick is None:
            raise AssertionError("Joystick has no visible bounding box")
        before = state(page)["player"]
        try:
            send_touch(cdp, "touchStart", joystick["x"] + joystick["width"] / 2, joystick["y"] + joystick["height"] * 0.16)
            page.wait_for_timeout(1600)
            during = state(page)["player"]
        finally:
            send_touch(cdp, "touchCancel")
        moved = distance(before, during)
        check("real joystick touch changes world position", moved > 0.5, {"before": before, "during": during, "distanceMetres": moved})
        try:
            page.wait_for_function("window.__THREE_GAME_DIAGNOSTICS__.state.player.speed<0.08 && window.__THREE_GAME_DIAGNOSTICS__.state.player.animation==='Idle'", timeout=5000)
        except Exception as error:
            report["errors"].append("Joystick stop wait: " + concise(error))
        stopped = state(page)["player"]
        check("touchCancel brakes to Idle", stopped["speed"] < 0.08 and stopped["animation"] == "Idle", stopped)
        page.wait_for_timeout(700)
        after_stop = state(page)["player"]
        check("avatar remains stopped after cancellation", distance(stopped, after_stop) < 0.03, {"stopped": stopped, "after": after_stop})

        checkpoint("optional real touch camera drag")
        before_camera = state(page).get("camera")
        if before_camera is None:
            report["cameraGesture"] = {"status": "not_verified", "reason": "Read-only camera diagnostics are absent; no yaw change can be proved."}
        else:
            free_area = page.evaluate("""() => {
              const y=innerHeight*.44, x=innerWidth*.5, endX=x+Math.min(70,innerWidth*.18);
              const world=document.getElementById('world');
              return {x,y,endX,free:document.elementFromPoint(x,y)===world&&document.elementFromPoint(endX,y)===world};
            }""")
            check("camera drag uses an unobstructed world area", free_area["free"], free_area)
            if free_area["free"]:
                try:
                    send_touch(cdp, "touchStart", free_area["x"], free_area["y"], identifier=9)
                    page.wait_for_timeout(100)
                    send_touch(cdp, "touchMove", free_area["endX"], free_area["y"], identifier=9)
                    page.wait_for_timeout(200)
                finally:
                    send_touch(cdp, "touchCancel", identifier=9)
                after_camera = state(page).get("camera", {})
                yaw_delta = abs(after_camera.get("yaw", before_camera["yaw"]) - before_camera["yaw"])
                camera_pass = check("CDP touch drag changes real camera yaw", yaw_delta > 0.01, {"before": before_camera, "after": after_camera, "deltaYaw": yaw_delta})
                report["cameraGesture"] = {"status": "pass" if camera_pass else "failed", "before": before_camera, "after": after_camera, "deltaYaw": yaw_delta}
            else:
                report["cameraGesture"] = {"status": "not_verified", "reason": "Candidate world area is covered by interface elements."}
        cdp.detach()

        checkpoint("ten-second active performance sample")
        if not no_dialog(page):
            raise AssertionError("Performance sampling requires no open dialog")
        sample_started = time.monotonic()
        page.wait_for_timeout(10000)
        active_sample = state(page)
        still_active = no_dialog(page)
        performance = active_sample.get("performance", {})
        report["portraitActiveSample"] = {
            "secondsWaited": round(time.monotonic() - sample_started, 3),
            "noOpenDialog": still_active,
            "player": active_sample["player"],
            "performance": performance,
            "quality": active_sample.get("quality"),
        }
        check("performance sample has no open dialog", still_active)
        fps, frame_ms = performance.get("fps"), performance.get("frameMs")
        check("active RAF performance is measured", still_active and isinstance(fps, (int, float)) and isinstance(frame_ms, (int, float)) and math.isfinite(fps) and math.isfinite(frame_ms) and fps > 0 and frame_ms > 0, performance)
        report["renderer"] = page.evaluate("""() => {
          const d=window.__THREE_GAME_DIAGNOSTICS__,c=document.getElementById('world');
          const gl=c.getContext('webgl2')||c.getContext('webgl'),ext=gl&&gl.getExtension('WEBGL_debug_renderer_info');
          return {calls:d.renderer.render.calls,triangles:d.renderer.render.triangles,memory:d.renderer.memory,
            backingWidth:c.width,backingHeight:c.height,
            gpu:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):null,
            glVersion:gl?gl.getParameter(gl.VERSION):null};
        }""")

        checkpoint("rotate emulated viewport to landscape")
        page.set_viewport_size({"width": 844, "height": 390})
        page.wait_for_timeout(700)
        control_layout(page, "landscape")
        check("landscape keeps game active", no_dialog(page))
        capture(page, "mobile-probe-landscape-active.png")
        check("no uncaught browser or console errors", not report["pageErrors"] and not report["consoleErrors"], {"pageErrors": report["pageErrors"], "consoleErrors": report["consoleErrors"]})
        report["status"] = "pass" if not report["errors"] and all(c["pass"] for c in report["checks"]) else "failed"
        checkpoint("mobile probe complete")
        context.close()
        browser.close()
except Exception as error:
    report["status"] = "blocked" if "BrowserType.launch" in str(error) else "failed"
    report["errors"].append(concise(error))
    report["traceback"] = traceback.format_exc()
    checkpoint("probe interrupted by failure")
finally:
    checkpoint(report["status"])
    print(json.dumps({"status": report["status"], "checks": len(report["checks"]), "captures": report["captures"]}))

if report["status"] != "pass":
    raise SystemExit(1)
