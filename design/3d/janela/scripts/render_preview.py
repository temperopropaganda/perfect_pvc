"""Render de conferência (não salva o .blend).

    blender --background janela.blend --python scripts/render_preview.py -- \
        --frame 40 --out renders/aberta.png [--scale 50] [--samples 48] [--view front|three_quarter]
"""
import argparse
import math
import sys

import bpy
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
ap = argparse.ArgumentParser()
ap.add_argument("--frame", type=int, default=40)
ap.add_argument("--out", required=True)
ap.add_argument("--scale", type=int, default=50)
ap.add_argument("--samples", type=int, default=48)
ap.add_argument("--view", default="site", help="site | front | three_quarter | detail")
ap.add_argument("--engine", default="CYCLES")
ap.add_argument("--cam", help="close: posição da câmera x,y,z (Blender)")
ap.add_argument("--target", help="close: ponto observado x,y,z (Blender)")
ap.add_argument("--lens", type=float, default=50.0)
args = ap.parse_args(argv)

scene = bpy.context.scene
scene.frame_set(args.frame)
scene.render.resolution_percentage = args.scale
scene.render.engine = "BLENDER_EEVEE" if args.engine == "EEVEE" else "CYCLES"
scene.cycles.samples = args.samples
scene.cycles.device = "CPU"

if args.view == "site":
    scene.camera = bpy.data.objects["Camera_Site"]
    scene.render.resolution_x, scene.render.resolution_y = 1080, 1200
else:
    scene.camera = bpy.data.objects["Camera_Preview"]
    scene.render.resolution_x, scene.render.resolution_y = 2000, 1066
cam = scene.camera
if args.view == "three_quarter":
    cam.location = (1.9, -2.6, 0.6)
    cam.rotation_euler = (Vector((0, 0, 0)) - cam.location).to_track_quat("-Z", "Y").to_euler()
elif args.view == "detail":
    cam.location = (-0.15, -1.35, 0.12)
    cam.rotation_euler = (Vector((0.06, -0.66, -0.02)) - cam.location).to_track_quat("-Z", "Y").to_euler()

if args.cam and args.target:
    cam.data = cam.data.copy()
    cam.data.lens = args.lens
    cam.data.sensor_fit = "HORIZONTAL"
    cam.location = [float(v) for v in args.cam.split(",")]
    target = Vector([float(v) for v in args.target.split(",")])
    cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()
    scene.render.resolution_x, scene.render.resolution_y = 1200, 900

scene.render.filepath = args.out
bpy.ops.render.render(write_still=True)
print("RENDERED", args.out)
