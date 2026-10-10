#!/usr/bin/env python3
"""Download a fixed set of research images into a private QA artifact directory.

These are third-party study references, not licensed game assets or captures of
TOGO LIFE. Downloading an image does not mean its pixels have been inspected.
No account, authentication, site crawling, or proprietary game download occurs.
"""

from __future__ import annotations

import argparse
from contextlib import contextmanager
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import signal
import time
import urllib.error
import urllib.request


TIMEOUT_SECONDS = 15
MAX_IMAGE_BYTES = 4 * 1024 * 1024
REFERENCES = (
    {
        "id": "townsmen-5-01",
        "game": "Townsmen 5 (Java, 2008)",
        "url": "https://downloadwap.com/thumbs4/games/preview/176x208/Games/2/1284172173-1.jpg",
        "source_document": "docs/TOWNSMEN_INTERFACE_RESEARCH.md",
        "source_page": "https://mobile.phoneky.com/games/?id=j4j17017",
        "provenance": "Third-party game preview, not an official distribution or asset license.",
    },
    {
        "id": "townsmen-5-02",
        "game": "Townsmen 5 (Java, 2008)",
        "url": "https://downloadwap.com/thumbs4/games/preview/2020d/img/2/459405_townsmen_5_2.jpg",
        "source_document": "docs/TOWNSMEN_INTERFACE_RESEARCH.md",
        "source_page": "https://mobile.phoneky.com/games/?id=j4j17017",
        "provenance": "Third-party game preview, not an official distribution or asset license.",
    },
    {
        "id": "townsmen-5-pocketgamer",
        "game": "Townsmen 5 (Java, 2008)",
        "url": "https://media.pocketgamer.com/artwork/na-elxy/townsmen1.gif",
        "source_document": "docs/TOWNSMEN_INTERFACE_RESEARCH.md",
        "source_page": "https://www.pocketgamer.com/townsmen-5/review/",
        "provenance": "Image linked by the contemporary review; GIF kept in its original format.",
    },
    {
        "id": "lagos-life-work",
        "game": "Lagos Life",
        "url": "https://nexalgaming.co/cdn-cgi/image/width%3D800%2Cformat%3Dauto/cdn-cgi/imagedelivery/4-uVHHk5QQ1cIDzJPkVNLQ/screenshot-2026-10-05-084729-11f7b6e2/public",
        "source_document": "docs/LAGOS_INTERFACE_RESEARCH.md",
        "source_page": "https://nexalgaming.co/post/lagos-life-crosses-1-million-gamers-in-5-days",
        "provenance": "Journalistic image, linked in the research report; not our own gameplay session.",
    },
    {
        "id": "lagos-life-market",
        "game": "Lagos Life",
        "url": "https://lagoslife.today/assets/img/hero-gameplay.png",
        "source_document": "docs/LAGOS_INTERFACE_RESEARCH.md",
        "source_page": "https://lagoslife.today/",
        "provenance": "Independent guide's claimed gameplay image, not an official game domain.",
    },
    {
        "id": "lagos-life-jobs",
        "game": "Lagos Life",
        "url": "https://lagoslifestyle.wiki/_astro/jobs-app.BVd2ZIom_1iw0kt.webp",
        "source_document": "docs/LAGOS_INTERFACE_RESEARCH.md",
        "source_page": "https://lagoslifestyle.wiki/money/jobs-and-salaries",
        "provenance": "Independent guide's claimed October 6 screenshot; date not independently authenticated.",
    },
    {
        "id": "lagos-life-career",
        "game": "Lagos Life",
        "url": "https://lagoslifestyle.wiki/_astro/career-panel.LQcH-Kvy_OlGJn.webp",
        "source_document": "docs/LAGOS_INTERFACE_RESEARCH.md",
        "source_page": "https://lagoslifestyle.wiki/money/jobs-and-salaries",
        "provenance": "Independent guide's claimed October 6 screenshot; date not independently authenticated.",
    },
)
ALLOWED_URLS = frozenset(reference["url"] for reference in REFERENCES)
ALLOWED_MIME = {
    "image/png": "png", "image/x-png": "png",
    "image/jpeg": "jpg", "image/pjpeg": "jpg",
    "image/webp": "webp", "image/gif": "gif",
}


class AllowlistedRedirects(urllib.request.HTTPRedirectHandler):
    """Do not let a reference response redirect this script to an arbitrary URL."""

    def redirect_request(self, request, response, code, message, headers, new_url):
        if new_url not in ALLOWED_URLS:
            raise urllib.error.HTTPError(request.full_url, code,
                                         "Redirect destination is outside the exact URL allowlist.",
                                         headers, None)
        return super().redirect_request(request, response, code, message, headers, new_url)


@contextmanager
def request_deadline():
    """Bound the whole request on the Linux QA runner, including trickled bodies."""
    if not hasattr(signal, "SIGALRM"):
        yield  # urllib's socket timeout remains active on other platforms.
        return
    def expired(_signal, _frame):
        raise TimeoutError("Reference request exceeded the 15-second time limit.")
    previous_handler = signal.signal(signal.SIGALRM, expired)
    previous_timer = signal.setitimer(signal.ITIMER_REAL, TIMEOUT_SECONDS)
    started = time.monotonic()
    try:
        yield
    finally:
        signal.setitimer(signal.ITIMER_REAL, 0)
        signal.signal(signal.SIGALRM, previous_handler)
        if previous_timer[0] > 0:
            remaining = max(.001, previous_timer[0] - (time.monotonic() - started))
            signal.setitimer(signal.ITIMER_REAL, remaining, previous_timer[1])


def image_format(data: bytes) -> str | None:
    """Check actual file signatures; an HTML error served as image/png is rejected."""
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return "png"
    if data.startswith(b"\xff\xd8\xff"):
        return "jpg"
    if data[:6] in (b"GIF87a", b"GIF89a"):
        return "gif"
    if len(data) >= 12 and data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "webp"
    return None


def fetch_reference(reference: dict, output_dir: Path, opener) -> dict:
    result = {**reference, "status": "not_attempted", "bytes": 0,
              "pixels_inspected": False}
    started = time.monotonic()
    # Stable filenames never derive from the response's Content-Disposition.
    for extension in ("png", "jpg", "webp", "gif"):
        (output_dir / f"{reference['id']}.{extension}").unlink(missing_ok=True)
    try:
        request = urllib.request.Request(reference["url"], headers={
            "User-Agent": "TOGO-LIFE-Reference-Study/1.0",
            "Accept": "image/png,image/jpeg,image/webp,image/gif",
        })
        with request_deadline(), opener.open(request, timeout=TIMEOUT_SECONDS) as response:
            result["http_status"] = response.status
            result["response_url"] = response.geturl()
            if result["response_url"] not in ALLOWED_URLS:
                result["status"] = "redirect_not_allowed"
                return result
            mime = response.headers.get_content_type().lower()
            result["content_type"] = mime
            if mime not in ALLOWED_MIME:
                result["status"] = "unsupported_mime"
                return result
            length = response.headers.get("Content-Length")
            if length and length.isdecimal() and int(length) > MAX_IMAGE_BYTES:
                result["status"] = "too_large"
                result["declared_bytes"] = int(length)
                return result
            data = response.read(MAX_IMAGE_BYTES + 1)
            result["bytes"] = len(data)
            if len(data) > MAX_IMAGE_BYTES:
                result["status"] = "too_large"
                return result
            if time.monotonic() - started > TIMEOUT_SECONDS:
                result["status"] = "time_limit_exceeded"
                return result
            detected = image_format(data)
            if detected is None or detected != ALLOWED_MIME[mime]:
                result["status"] = "invalid_image_header"
                return result
            filename = f"{reference['id']}.{detected}"
            (output_dir / filename).write_bytes(data)
            result.update(status="downloaded", file=filename, format=detected,
                          sha256=hashlib.sha256(data).hexdigest())
    except urllib.error.HTTPError as error:
        result.update(status="redirect_not_allowed" if 300 <= error.code < 400 else "http_error",
                      http_status=error.code, error=str(error.reason)[:240])
    except (urllib.error.URLError, TimeoutError, ConnectionError, OSError) as error:
        result.update(status="network_or_io_error", error=str(error)[:240])
    finally:
        result["elapsed_seconds"] = round(time.monotonic() - started, 3)
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path,
                        default=Path(__file__).resolve().parents[1] / "artifacts" / "references")
    parser.add_argument("--list", action="store_true", help="List the fixed allowlist without network access.")
    args = parser.parse_args()
    if args.list:
        print(json.dumps(REFERENCES, ensure_ascii=False, indent=2))
        return 0
    args.output_dir.mkdir(parents=True, exist_ok=True)
    opener = urllib.request.build_opener(AllowlistedRedirects())
    results = [fetch_reference(reference, args.output_dir, opener) for reference in REFERENCES]
    count = sum(result["status"] == "downloaded" for result in results)
    manifest = {
        "schema_version": 1,
        "created_utc": datetime.now(timezone.utc).isoformat(),
        "warning": "Third-party study references only. Not licensed game assets, not TOGO LIFE captures. "
                   "Do not publish, copy into assets, or commit the downloaded image files. "
                   "Download success does not establish visual inspection, authenticity, or gameplay validation.",
        "pixels_inspected": False,
        "timeout_seconds": TIMEOUT_SECONDS,
        "max_image_bytes": MAX_IMAGE_BYTES,
        "attempted": len(results),
        "downloaded": count,
        "images": results,
    }
    (args.output_dir / "reference_manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Reference study: {count}/{len(results)} images downloaded; pixels not yet inspected.")
    for result in results:
        if result["status"] != "downloaded":
            print(f"  {result['id']}: {result['status']}")
    # A blocked third-party server must not make gameplay QA fail.
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
