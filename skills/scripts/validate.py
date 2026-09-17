"""Offline package checks. Run from any directory with Python 3."""
import re
import sys
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]


def validate(root):
    errors = []
    skills = sorted((root / "skills").glob("*/SKILL.md"))
    if not skills:
        errors.append("No skills found")
    names = set()
    for path in skills:
        content = path.read_text(encoding="utf-8")
        match = re.match(r"\A---\nname: ([a-z0-9-]{1,64})\ndescription: ([^\n]+)\n---\n", content)
        if not match:
            errors.append(f"Invalid name/description frontmatter: {path.relative_to(root)}")
            continue
        name, description = match.groups()
        if name != path.parent.name or name in names:
            errors.append(f"Duplicate name or folder mismatch: {name}")
        names.add(name)
        if not description.strip():
            errors.append(f"Empty description: {name}")

    for path in root.rglob("*.md"):
        content = path.read_text(encoding="utf-8")
        if "\ufffd" in content:
            errors.append(f"Replacement character: {path.relative_to(root)}")
        for target in re.findall(r"\[[^\]]*\]\(([^)]+)\)", content):
            if re.match(r"^[a-z]+://", target) or target.startswith("#"):
                continue
            destination = (path.parent / unquote(target.split("#", 1)[0])).resolve()
            try:
                destination.relative_to(root.resolve())
            except ValueError:
                errors.append(f"External local dependency: {path.name}: {target}")
                continue
            if not destination.exists():
                errors.append(f"Broken link: {path.relative_to(root)}: {target}")

    license_path = root / "LICENSE"
    if not license_path.exists() or "Copyright (c) 2026 zhaoxuya520" not in license_path.read_text(encoding="utf-8"):
        errors.append("Missing upstream copyright notice")
    return skills, errors


if __name__ == "__main__":
    found, failures = validate(ROOT)
    for failure in failures:
        print("FAIL:", failure)
    if failures:
        sys.exit(1)
    print(f"PASS: {len(found)} skills; names, UTF-8, local links, isolation and license checked.")
