"""Build a map track from an OG1 glider file (or Slocum .mlg logs) and add it to a data/glider_tracks_*.json file.

The track files in data/ are what the fieldwork and project maps plot, so once a track is
written there the source OG1 file is no longer needed (it can move or be archived).

Positions: GPS surface fixes (LATITUDE_GPS/LONGITUDE_GPS/TIME_GPS) when the file has them,
otherwise LATITUDE/LONGITUDE/TIME. If the input is a directory instead of a file, it is
read as Slocum .mlg text logs and their "GPS Location" lines are used (for missions with no
full OG1 file yet, e.g. iFADO Leg 1 Aisling na Mara, raw/logs/). GPS variables that are present
but all empty count as absent. Fixes that would need a speed above --max-speed (m/s) from the
previous kept fix are dropped (bad fixes, not long gaps), then the track is thinned to at most
--max-points points.

A track with the same id is replaced; all other tracks in the output file are kept.

Usage:
    python3.11 tools/og1_to_track.py <og1.nc> --name SG152 --project iFADO \
        --region "European Atlantic Arc" --link fieldwork.html#project-ifado \
        --out data/glider_tracks_ifado.json [--start 2022-12-09] [--end 2023-03-16]

After adding a new output file, add its project key to the `projects` list in
js/glider-map.js (and a colour set in PROJECT_COLORS) so the fieldwork map loads it.
"""
import argparse
import datetime as dt
import glob
import json
import os
import re

import numpy as np
import xarray as xr


def positions(ds):
    if all(v in ds for v in ("LATITUDE_GPS", "LONGITUDE_GPS", "TIME_GPS")) and np.isfinite(ds.LATITUDE_GPS.values).any():
        lat, lon, t = ds.LATITUDE_GPS.values, ds.LONGITUDE_GPS.values, ds.TIME_GPS.values
        kind = "GPS fixes"
    else:
        lat, lon, t = ds.LATITUDE.values, ds.LONGITUDE.values, ds.TIME.values
        kind = "LATITUDE/LONGITUDE"
    ok = np.isfinite(lat) & np.isfinite(lon) & ~np.isnat(t)
    order = np.argsort(t[ok], kind="stable")
    return t[ok][order], lat[ok][order], lon[ok][order], kind


def haversine_km(la1, lo1, la2, lo2):
    p = np.radians
    h = np.sin(p(la2 - la1) / 2) ** 2 + np.cos(p(la1)) * np.cos(p(la2)) * np.sin(p(lo2 - lo1) / 2) ** 2
    return 2 * 6371 * np.arcsin(np.sqrt(h))


def mlg_positions(logdir):
    re_cur = re.compile(r"^Curr Time:\s+\w+\s+(\w+\s+\d+\s+[\d:]+\s+\d{4})")
    re_gps = re.compile(r"^GPS Location:\s+(-?[\d.]+)\s+N\s+(-?[\d.]+)\s+E\s+measured\s+([\d.]+)\s+secs ago")

    def ddmm(x):
        s = np.sign(x)
        x = abs(x)
        return s * (x // 100 + (x % 100) / 60)

    fixes = {}
    for f in glob.glob(os.path.join(logdir, "*.mlg")):
        cur = None
        for line in open(f, encoding="latin1"):
            m = re_cur.match(line)
            if m:
                cur = dt.datetime.strptime(" ".join(m.group(1).split()), "%b %d %H:%M:%S %Y")
                continue
            m = re_gps.match(line)
            if m and cur is not None:
                la, lo, ago = map(float, m.groups())
                if abs(la) > 9000 or abs(lo) > 18000:  # 69696969-style invalid fixes
                    continue
                fixes[np.datetime64(cur - dt.timedelta(seconds=ago), "ms")] = (ddmm(la), ddmm(lo))
    t = np.array(sorted(fixes))
    return t, np.array([fixes[k][0] for k in t]), np.array([fixes[k][1] for k in t]), "Slocum .mlg GPS fixes"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("og1")
    ap.add_argument("--name", required=True)
    ap.add_argument("--project", required=True)
    ap.add_argument("--region", required=True)
    ap.add_argument("--link", default="")
    ap.add_argument("--out", required=True)
    ap.add_argument("--start")
    ap.add_argument("--end")
    ap.add_argument("--max-points", type=int, default=500)
    ap.add_argument("--max-speed", type=float, default=3.0)
    a = ap.parse_args()

    if os.path.isdir(a.og1):
        t, lat, lon, kind = mlg_positions(a.og1)
        src = "/".join(os.path.normpath(a.og1).split(os.sep)[-3:])  # e.g. <mission>/raw/logs
    else:
        t, lat, lon, kind = positions(xr.open_dataset(a.og1, decode_timedelta=False))
        src = os.path.basename(a.og1)
    sel = np.ones(t.shape, bool)
    if a.start:
        sel &= t >= np.datetime64(a.start)
    if a.end:
        sel &= t <= np.datetime64(a.end)
    t, lat, lon = t[sel], lat[sel], lon[sel]
    if not len(t):
        raise SystemExit("no valid positions in range")

    tsec = (t - t[0]).astype("timedelta64[ms]").astype(float) / 1000
    keep = [0]
    for i in range(1, len(t)):
        j = keep[-1]
        km = haversine_km(lat[j], lon[j], lat[i], lon[i])
        if km * 1000 <= a.max_speed * max(tsec[i] - tsec[j], 1.0) + 1000:  # 1 km slack for GPS scatter
            keep.append(i)
    t, lat, lon = t[keep], lat[keep], lon[keep]

    idx = np.unique(np.linspace(0, len(t) - 1, min(a.max_points, len(t))).round().astype(int))
    coords = [[round(float(lat[i]), 4), round(float(lon[i]), 4)] for i in idx]
    date = str(t[0].astype("datetime64[D]"))
    track = {
        "name": a.name,
        "date": date,
        "num_points": len(coords),
        "project": a.project,
        "region": a.region,
        "link": a.link,
        "id": f"{a.project.lower()}_{a.name.split()[0]}_{date}",
        "source": f"{src} ({kind}, {date} to {t[-1].astype('datetime64[D]')})",
        "coordinates": coords,
    }

    tracks = json.load(open(a.out)) if os.path.exists(a.out) else []
    tracks = [x for x in tracks if x.get("id") != track["id"]] + [track]
    json.dump(tracks, open(a.out, "w"))
    print(f"{a.name}: {len(t)} positions ({kind}), {len(coords)} written to {a.out}")


if __name__ == "__main__":
    main()
