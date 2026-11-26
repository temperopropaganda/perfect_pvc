"""Auditoria geométrica da janela (não altera nem salva o .blend).

    blender --background janela.blend --python scripts/audit_geometry.py -- [--frames 0,30,60,90,120]

Relata, por objeto e já com modificadores aplicados (como sai no GLB):
  - arestas não-manifold, faces degeneradas, vértices duplicados, ilhas soltas;
  - faces internas coincidentes (geometria escondida dentro do sólido);
  - enrolamento inconsistente (normais invertidas);
  - triângulos-lâmina (finos demais: serrilham no navegador);
  - faces coplanares sobrepostas entre objetos (z-fighting);
  - colisões entre peças móveis e o marco em todos os quadros da animação.
"""
import argparse
import json
import math
import sys
from collections import defaultdict

import bmesh
import bpy
from mathutils import Vector
from mathutils.bvhtree import BVHTree

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
ap = argparse.ArgumentParser()
ap.add_argument("--sliver-px", type=float, default=0.6,
                help="largura mínima (px) de um triângulo na vista do site")
args = ap.parse_args(argv)

scene = bpy.context.scene
MOVING = ["Folha_Movel", "Vidro", "Vedacao_Folha", "Macaneta", "Macaneta_Alavanca"]
FIXED = ["Frame_Fixo", "Vedacao_Marco"]
# Escala da vista do site: janela de 1,45 m ocupa cerca de 600 px de altura.
PX_PER_M = 600 / 1.45


def evaluated_bmesh(ob, world=True):
    dg = bpy.context.evaluated_depsgraph_get()
    ev = ob.evaluated_get(dg)
    me = ev.to_mesh()
    bm = bmesh.new()
    bm.from_mesh(me)
    ev.to_mesh_clear()
    if world:
        bm.transform(ob.matrix_world)
    return bm


def mesh_report(ob):
    bm = evaluated_bmesh(ob, world=False)
    bm.edges.ensure_lookup_table()
    non_manifold = sum(1 for e in bm.edges if not e.is_manifold)
    boundary = sum(1 for e in bm.edges if e.is_boundary)
    degenerate = sum(1 for f in bm.faces if f.calc_area() < 1e-10)
    # enrolamento: num sólido fechado, cada aresta é percorrida em sentidos opostos
    flipped = 0
    for e in bm.edges:
        if len(e.link_faces) != 2:
            continue
        dirs = []
        for f in e.link_faces:
            for loop in f.loops:
                if loop.edge == e:
                    dirs.append(loop.vert == e.verts[0])
        if len(dirs) == 2 and dirs[0] == dirs[1]:
            flipped += 1
    # vértices duplicados (mesma posição)
    seen = defaultdict(int)
    for v in bm.verts:
        seen[tuple(round(c, 6) for c in v.co)] += 1
    dup_verts = sum(n - 1 for n in seen.values() if n > 1)
    # faces internas coincidentes: dois polígonos com o mesmo conjunto de posições
    face_keys = defaultdict(int)
    for f in bm.faces:
        face_keys[tuple(sorted(tuple(round(c, 6) for c in v.co) for v in f.verts))] += 1
    coincident_faces = sum(n for n in face_keys.values() if n > 1)
    islands = len(bm_islands(bm))
    # triângulos-lâmina: menor altura do triângulo em pixels na escala do site
    tris = bm.calc_loop_triangles()
    slivers = 0
    for t in tris:
        a, b, c = (l.vert.co for l in t)
        area = (b - a).cross(c - a).length / 2
        longest = max((b - a).length, (c - b).length, (a - c).length)
        height_px = (2 * area / longest) * PX_PER_M if longest else 0
        if height_px < args.sliver_px:
            slivers += 1
    rep = {"tris": len(tris), "nao_manifold": non_manifold, "bordas_abertas": boundary,
           "degeneradas": degenerate, "enrolamento_invertido": flipped,
           "vertices_duplicados": dup_verts, "faces_internas_coincidentes": coincident_faces,
           "ilhas": islands, "triangulos_lamina": slivers}
    bm.free()
    return rep


def bm_islands(bm):
    bm.verts.ensure_lookup_table()
    seen, islands = set(), []
    for v in bm.verts:
        if v.index in seen:
            continue
        stack, comp = [v], []
        seen.add(v.index)
        while stack:
            cur = stack.pop()
            comp.append(cur.index)
            for e in cur.link_edges:
                o = e.other_vert(cur)
                if o.index not in seen:
                    seen.add(o.index)
                    stack.append(o)
        islands.append(comp)
    return islands


def coplanar_overlaps(names):
    """Faces de objetos diferentes no mesmo plano e sobrepostas (risco de z-fighting)."""
    planes = []
    for n in names:
        bm = evaluated_bmesh(bpy.data.objects[n])
        for f in bm.faces:
            if f.calc_area() < 1e-8:
                continue
            nrm = f.normal.copy()
            d = nrm.dot(f.verts[0].co)
            vs = [v.co.copy() for v in f.verts]
            lo = Vector((min(v.x for v in vs), min(v.y for v in vs), min(v.z for v in vs)))
            hi = Vector((max(v.x for v in vs), max(v.y for v in vs), max(v.z for v in vs)))
            planes.append((n, nrm, d, lo, hi))
        bm.free()
    hits = defaultdict(int)
    for i in range(len(planes)):
        n1, a1, d1, lo1, hi1 = planes[i]
        for j in range(i + 1, len(planes)):
            n2, a2, d2, lo2, hi2 = planes[j]
            if n1 == n2:
                continue
            dot = a1.dot(a2)
            if abs(abs(dot) - 1) > 1e-5:
                continue
            if abs(d1 - math.copysign(1, dot) * d2) > 2e-5:
                continue
            ov = all(min(hi1[k], hi2[k]) - max(lo1[k], lo2[k]) > 1e-4 for k in range(3)
                     if abs(a1[k]) < 0.5)
            if ov:
                hits[f"{n1} x {n2}"] += 1
    return dict(hits)


def collisions():
    out = {}
    for f in range(scene.frame_start, scene.frame_end + 1):
        scene.frame_set(f)
        trees = {}
        for n in MOVING + FIXED:
            bm = evaluated_bmesh(bpy.data.objects[n])
            trees[n] = BVHTree.FromBMesh(bm)
            bm.free()
        hits = {f"{m} x {x}": len(trees[m].overlap(trees[x])) for m in MOVING for x in FIXED}
        hits = {k: v for k, v in hits.items() if v}
        if hits:
            out[f] = hits
    scene.frame_set(scene.frame_start)
    return out


report = {"objetos": {}}
for ob in bpy.data.objects:
    if ob.type == "MESH":
        report["objetos"][ob.name] = mesh_report(ob)
scene.frame_set(scene.frame_start)
report["coplanares_entre_objetos"] = coplanar_overlaps([o.name for o in bpy.data.objects
                                                        if o.type == "MESH"])
report["colisoes_por_quadro"] = collisions()
report["total_tris"] = sum(r["tris"] for r in report["objetos"].values())
print("AUDIT " + json.dumps(report))
