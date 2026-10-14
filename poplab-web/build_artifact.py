"""Buat versi fragmen index.html untuk dipublikasikan sebagai Artifact claude.ai.
Artifact membungkus halaman dengan <!doctype>/<head>/<body> sendiri, jadi yang
diambil hanya <title>, tag <link>, dan isi di antara penanda BODY-START/BODY-END."""
import pathlib, re

root = pathlib.Path(__file__).parent
src = (root / "index.html").read_text(encoding="utf-8")
head = re.search(r"<head>(.*?)</head>", src, re.S).group(1)
keep = [l.strip() for l in head.splitlines() if l.strip().startswith(("<title", "<link", '<meta name="description"'))]
body = src.split("<!--BODY-START-->")[1].split("<!--BODY-END-->")[0]
out = root / "dist" / "artifact.html"
out.parent.mkdir(exist_ok=True)
out.write_text("\n".join(keep) + "\n" + body.strip() + "\n", encoding="utf-8")
print(out)
