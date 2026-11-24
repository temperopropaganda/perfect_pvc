"""Exporta só a hierarquia "Janela" (sem câmera/luzes) para GLB, no estado fechado.

A linha do tempo da cena vira UMA animação glTF ("OsciloGiro", 4 s), que o site
controla pelo scroll: tempo = progresso x duração.

    blender --background janela.blend --python scripts/export_glb.py -- --out janela.glb
"""
import argparse
import json
import sys
from pathlib import Path

import bpy

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
ap = argparse.ArgumentParser()
ap.add_argument("--out", required=True)
args = ap.parse_args(argv)

scene = bpy.context.scene
SEQUENCE_NAME = "OsciloGiro"
scene.frame_set(scene.frame_start)  # pose de repouso do GLB = janela fechada

root = bpy.data.objects["Janela"]
for ob in bpy.data.objects:
    ob.select_set(False)
stack = [root]
while stack:
    ob = stack.pop()
    stack.extend(ob.children)
    ob.select_set(True)
bpy.context.view_layer.objects.active = root

out = Path(args.out).resolve()
bpy.ops.export_scene.gltf(
    filepath=str(out), export_format="GLB", use_selection=True,
    export_apply=True, export_yup=True,
    export_animations=True, export_animation_mode="SCENE",
    export_force_sampling=True, export_optimize_animation_size=True,
    export_anim_slide_to_zero=True,
    export_cameras=False, export_lights=False, export_extras=False,
    export_draco_mesh_compression_enable=False,
)


def rest_pose_from_first_key(path):
    """Grava em cada nó animado a pose do quadro 0 (janela fechada, alavanca para baixo).

    O exportador às vezes grava a pose do último quadro amostrado; usar a primeira
    chave de cada canal garante que o GLB carregue fechado, mesmo sem tocar a animação.
    """
    import struct
    data = path.read_bytes()
    json_len = struct.unpack("<I", data[12:16])[0]
    gltf = json.loads(data[20:20 + json_len])
    bin_start = 20 + json_len + 8
    for anim in gltf.get("animations", []):
        for ch in anim["channels"]:
            sampler = anim["samplers"][ch["sampler"]]
            acc = gltf["accessors"][sampler["output"]]
            view = gltf["bufferViews"][acc["bufferView"]]
            n = {"VEC3": 3, "VEC4": 4}[acc["type"]]
            off = bin_start + view.get("byteOffset", 0) + acc.get("byteOffset", 0)
            first = list(struct.unpack(f"<{n}f", data[off:off + 4 * n]))
            gltf["nodes"][ch["target"]["node"]][ch["target"]["path"]] = first
    # O modo SCENE gera uma animação por objeto; une todas num clip único.
    anims = gltf.get("animations", [])
    if len(anims) > 1:
        merged = {"name": SEQUENCE_NAME, "channels": [], "samplers": []}
        for anim in anims:
            base = len(merged["samplers"])
            merged["samplers"].extend(anim["samplers"])
            for ch in anim["channels"]:
                merged["channels"].append({**ch, "sampler": ch["sampler"] + base})
        gltf["animations"] = [merged]
    elif anims:
        anims[0]["name"] = SEQUENCE_NAME
    chunk = json.dumps(gltf, separators=(",", ":")).encode()
    chunk += b" " * (-len(chunk) % 4)
    rest = data[20 + json_len:]
    total = 12 + 8 + len(chunk) + len(rest)
    path.write_bytes(data[:8] + struct.pack("<I", total)
                     + struct.pack("<I", len(chunk)) + b"JSON" + chunk + rest)


rest_pose_from_first_key(out)
print("EXPORTED " + json.dumps({"file": str(out), "bytes": out.stat().st_size}))
