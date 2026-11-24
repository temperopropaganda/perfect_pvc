"""Constrói a janela de abrir (PVC off-white) com animação "OpenClose".

    blender --background --factory-startup --python scripts/build_janela.py -- --out janela.blend

Convenções (Blender, Z para cima, metros):
  - Janela centralizada na origem; face interna (lado do usuário/câmera) voltada para -Y.
  - No GLB (Y-up) a janela fica voltada para +Z, como a câmera padrão do three.js.
  - Folha_Movel tem o pivô na dobradiça (lado esquerdo, aresta frontal) e gira em Z.
"""
import argparse
import json
import math
import sys
from pathlib import Path

import bmesh
import bpy
from mathutils import Matrix, Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
ap = argparse.ArgumentParser()
ap.add_argument("--out", required=True)
ap.add_argument("--turn-angle", type=float, default=78.0, help="giro: ângulo máximo (graus)")
ap.add_argument("--tilt-angle", type=float, default=11.0, help="oscilobatente: ângulo máximo (graus)")
ap.add_argument("--oscilo-para", choices=["fora", "dentro"], default="fora",
                help="oscilobatente: topo da folha vai para fora (longe da câmera) ou para dentro")
ap.add_argument("--giro-para", choices=["fora", "dentro"], default="dentro",
                help="giro: folha abre para dentro (lado da câmera) ou para fora")
args = ap.parse_args(argv)

# ---------------------------------------------------------------- dimensões
# y = profundidade: y = 0 é a face interna do marco (lado da câmera), +y vai para fora.
FRAME_W, FRAME_H = 1.00, 1.45          # marco (externo)
FRAME_FACE = 0.049                      # largura do marco (vão livre = 0.902 x 1.352)
SASH_GAP = 0.052                        # da borda externa do marco até a borda da folha (3 mm de folga)
SASH_W = FRAME_W - 2 * SASH_GAP         # 0.896
SASH_H = FRAME_H - 2 * SASH_GAP         # 1.346
# A folha fica DENTRO do vão do marco, sem batente na frente nem atrás. Assim o
# oscilobatente pode sair para um lado e o giro para o outro sem tocar no marco.
SASH_Y0, SASH_Y1 = 0.002, 0.058         # faces interna e externa da folha
HANDLE_INSET = 0.028                    # centro da maçaneta a partir da borda da folha
TILT_OUT = args.oscilo_para == "fora"
TURN_IN = args.giro_para == "dentro"
# Cada pivô fica na aresta do lado para onde o movimento abre.
TILT_PIVOT_Y = SASH_Y1 if TILT_OUT else SASH_Y0   # eixo horizontal, aresta inferior
TURN_PIVOT_Y = SASH_Y0 if TURN_IN else SASH_Y1    # eixo vertical, lateral esquerda
TILT_ANGLE = math.radians(args.tilt_angle) * (-1 if TILT_OUT else 1)
TURN_ANGLE = math.radians(args.turn_angle) * (1 if TURN_IN else -1)
# Sequência: FECHADA -> OSCILOBATENTE -> FECHADA -> GIRO -> FECHADA.
# Quadro = progresso do scroll x 120 (0.25 = quadro 30, 0.5 = 60, 0.75 = 90).
FPS = 30
F_FECHADA_1, F_OSCILO, F_FECHADA_2, F_GIRO, F_FECHADA_3 = 0, 30, 60, 90, 120
FRAME_START, FRAME_END = F_FECHADA_1, F_FECHADA_3
SEQUENCE_NAME = "OsciloGiro"
# Uma única maçaneta, presa à folha: para baixo = fechada, horizontal = giro,
# para cima = oscilobatente (convenção das ferragens oscilobatentes).
LEVER_DOWN, LEVER_TURN, LEVER_UP = math.radians(-90), 0.0, math.radians(90)

# perfis (u = distância para dentro a partir da borda externa, y = profundidade)
# Cada perfil é um polígono convexo; RAIOS_* arredonda cada canto (metros) e o
# arredondamento vira geometria real, com normais calculadas (sem modificador Bevel).
PROFILE_MARCO = [(0.000, 0.000), (FRAME_FACE, 0.000), (FRAME_FACE, 0.070), (0.000, 0.070)]
RAIOS_MARCO = [0.0025, 0.0020, 0.0015, 0.0015]
PROFILE_FOLHA = [(0.000, SASH_Y0), (0.056, SASH_Y0), (0.068, 0.012),
                 (0.068, 0.048), (0.056, SASH_Y1), (0.000, SASH_Y1)]
RAIOS_FOLHA = [0.0020, 0.0030, 0.0010, 0.0010, 0.0020, 0.0020]
SEGMENTOS_RAIO = 3
# Vedações: embutidas 0,5 mm na peça onde estão presas, para nunca ficarem coplanares.
PROFILE_VED_MARCO = [(FRAME_FACE - 0.0005, 0.044), (FRAME_FACE + 0.0010, 0.044),
                     (FRAME_FACE + 0.0010, 0.054), (FRAME_FACE - 0.0005, 0.054)]
PROFILE_VED_VIDRO_FRENTE = [(0.064, 0.016), (0.078, 0.016), (0.078, 0.0225), (0.064, 0.0225)]
PROFILE_VED_VIDRO_TRAS = [(0.064, 0.0415), (0.078, 0.0415), (0.078, 0.048), (0.064, 0.048)]
PROFILE_VED_BORDA = [(-0.0012, 0.020), (0.0005, 0.020), (0.0005, 0.030), (-0.0012, 0.030)]
RAIO_VEDACAO = 0.0004
GLASS_INSET, GLASS_Y0, GLASS_Y1 = 0.062, 0.022, 0.042


def srgb_to_linear(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


# Antracita escuro com subtom azul-esverdeado. Cor de referência na tela: #1C2D31
# (sRGB 28, 45, 49). O site usa NeutralToneMapping, que comprime os tons muito escuros;
# com a base em #1C2D31 a face frontal saía (8, 33, 38). Esta base (linear) foi calibrada
# na luz e câmera do site para a face frontal aparecer como #1C2D31. Ela fica perto do
# albedo real de um PVC antracita (RAL 7016, #383E42), com o subtom azul-esverdeado.
COR_REFERENCIA_TELA = "#1C2D31"
COR_ESTRUTURA = (0.0391, 0.0555, 0.0606, 1.0)


# ---------------------------------------------------------------- limpeza
def reset_scene():
    for ob in list(bpy.data.objects):
        bpy.data.objects.remove(ob, do_unlink=True)
    for coll in (bpy.data.meshes, bpy.data.materials, bpy.data.cameras, bpy.data.lights,
                 bpy.data.actions, bpy.data.worlds):
        for block in list(coll):
            coll.remove(block)
    for c in list(bpy.data.collections):
        bpy.data.collections.remove(c)


def collection(name):
    c = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(c)
    return c


# ---------------------------------------------------------------- materiais
def principled(name, color, roughness, **extra):
    m = bpy.data.materials.new(name)
    if m.node_tree is None:
        m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = 0.0
    for key, val in extra.items():
        bsdf.inputs[key].default_value = val
    m.diffuse_color = color
    m["managed"] = True
    return m


def build_materials():
    # PVC antracita acetinado: dielétrico (metallic 0), F0 ~4% (Specular IOR Level 0.5,
    # que no glTF é o padrão e não gera extensão), rugosidade média para reflexos largos
    # e suaves, sem brilho de plástico nem aspecto cromado.
    mats = {
        "estrutura": principled("Estrutura_Antracita", COR_ESTRUTURA, 0.52,
                                **{"Specular IOR Level": 0.5}),
        "macaneta": principled("Macaneta_Antracita", COR_ESTRUTURA, 0.4,
                               **{"Specular IOR Level": 0.5}),
        "vedacao": principled("Vedacao_Preto", (0.006, 0.0062, 0.0068, 1.0), 0.78,
                              **{"Specular IOR Level": 0.35}),
        "vidro": principled("Vidro_Transparente", (0.97, 0.985, 0.98, 1.0), 0.02,
                            **{"Transmission Weight": 1.0, "IOR": 1.5}),
    }
    vidro = mats["vidro"]
    vidro.surface_render_method = "DITHERED"
    if hasattr(vidro, "use_raytrace_refraction"):
        vidro.use_raytrace_refraction = True
    return mats


# ---------------------------------------------------------------- geometria
def fillet_profile(points, radii, segments):
    """Polígono convexo (u, y) -> [(u, y, nu, ny)] com cantos arredondados.

    As normais são analíticas: nos pontos de tangência valem a normal da face plana
    vizinha, então as faces planas continuam perfeitamente planas e o raio sombreia
    como uma curva contínua.
    """
    n = len(points)
    area = sum(points[i][0] * points[(i + 1) % n][1] - points[(i + 1) % n][0] * points[i][1]
               for i in range(n)) / 2
    radii = radii if isinstance(radii, (list, tuple)) else [radii] * n
    out = []
    for i in range(n):
        p0, p1, p2 = (Vector(points[i - 1]), Vector(points[i]), Vector(points[(i + 1) % n]))
        e1, e2 = p1 - p0, p2 - p1
        if (e1.x * e2.y - e1.y * e2.x) * area <= 0:
            raise ValueError(f"perfil não convexo no ponto {i}: {points[i]}")
        d1, d2 = (p0 - p1).normalized(), (p2 - p1).normalized()
        half = d1.angle(d2) / 2
        r = radii[i]
        t = r / math.tan(half)
        if t > 0.5 * min(e1.length, e2.length) + 1e-9:
            raise ValueError(f"raio {r} grande demais para o canto {i}")
        center = p1 + (d1 + d2).normalized() * (r / math.sin(half))
        va, vb = (p1 + d1 * t) - center, (p1 + d2 * t) - center
        start = math.atan2(va.y, va.x)
        sweep = math.atan2(va.x * vb.y - va.y * vb.x, va.dot(vb))
        for k in range(segments + 1):
            ang = start + sweep * k / segments
            nrm = Vector((math.cos(ang), math.sin(ang)))
            pt = center + nrm * r
            out.append((pt.x, pt.y, nrm.x, nrm.y))
    return out


class LoopMesh:
    """Malha de perfis varridos em volta de retângulos, soldada nos cantos a 45°.

    Cada volta é um sólido fechado e manifold (sem tampas internas). As normais por
    canto de face vêm do perfil: as quinas a 45° ficam definidas e as faces planas,
    planas.
    """
    INWARD = (Vector((0, 0, 1)), Vector((-1, 0, 0)), Vector((0, 0, -1)), Vector((1, 0, 0)))

    def __init__(self):
        self.verts, self.faces, self.normals = [], [], []

    def add_loop(self, half_w, half_h, profile, offset=Vector((0, 0, 0))):
        n = len(profile)
        base = len(self.verts)
        for c in range(4):  # cantos: BL, BR, TR, TL
            for (u, y, _, _) in profile:
                a, b = half_w - u, half_h - u
                x, z = ((-a, -b), (a, -b), (a, b), (-a, b))[c]
                self.verts.append(offset + Vector((x, y, z)))
        vid = lambda c, i: base + c * n + i  # noqa: E731
        for side in range(4):  # lados: inferior, direito, superior, esquerdo
            c0, c1 = side, (side + 1) % 4
            inward = self.INWARD[side]
            for i in range(n):
                j = (i + 1) % n
                face = [vid(c0, i), vid(c1, i), vid(c1, j), vid(c0, j)]
                nrm = [(inward * profile[k][2] + Vector((0, 1, 0)) * profile[k][3]).normalized()
                       for k in (i, i, j, j)]
                geo = (self.verts[face[1]] - self.verts[face[0]]).cross(
                    self.verts[face[3]] - self.verts[face[0]])
                if geo.dot(sum(nrm, Vector())) < 0:
                    face.reverse()
                    nrm.reverse()
                self.faces.append(face)
                self.normals.append(nrm)

    def to_mesh(self, name, material):
        me = bpy.data.meshes.new(name)
        me.from_pydata([tuple(v) for v in self.verts], [], self.faces)
        me.update()
        for p in me.polygons:
            p.use_smooth = True
        loop_normals = [None] * len(me.loops)
        for poly, nrm in zip(me.polygons, self.normals):
            for k, li in enumerate(poly.loop_indices):
                loop_normals[li] = tuple(nrm[k])
        me.normals_split_custom_set(loop_normals)
        me.materials.append(material)
        me.validate()
        return me


def add_box(bm, center, size):
    m = Matrix.Translation(Vector(center)) @ Matrix.Diagonal((*size, 1.0))
    bmesh.ops.create_cube(bm, size=1.0, matrix=m)


def add_cylinder(bm, center, radius, depth, axis="Z", segments=16):
    rot = {"Z": Matrix.Identity(4),
           "Y": Matrix.Rotation(math.radians(90), 4, "X"),
           "X": Matrix.Rotation(math.radians(90), 4, "Y")}[axis]
    m = Matrix.Translation(Vector(center)) @ rot
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=segments,
                          radius1=radius, radius2=radius, depth=depth, matrix=m)


def finish_mesh(name, bm, material, smooth_angle=None):
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    me.materials.append(material)
    if smooth_angle is not None:
        for p in me.polygons:
            p.use_smooth = True
        me.set_sharp_from_angle(angle=math.radians(smooth_angle))
    return me


def make_object(name, mesh, coll, parent=None, location=(0, 0, 0)):
    ob = bpy.data.objects.new(name, mesh)
    coll.objects.link(ob)
    ob.location = location
    if parent is not None:
        ob.parent = parent
    ob["managed"] = True
    return ob


def add_bevel(ob, width, segments, angle=30.0, harden=True):
    mod = ob.modifiers.new("Bevel", "BEVEL")
    mod.width = width
    mod.segments = segments
    mod.limit_method = "ANGLE"
    mod.angle_limit = math.radians(angle)
    mod.harden_normals = harden
    mod.miter_outer = "MITER_ARC"
    for p in ob.data.polygons:
        p.use_smooth = True
    return mod


# ---------------------------------------------------------------- montagem
def build():
    reset_scene()
    scene = bpy.context.scene
    scene.unit_settings.system = "METRIC"
    scene.render.fps = FPS
    scene.frame_start, scene.frame_end = FRAME_START, FRAME_END

    c_janela = collection("Janela")
    c_cam = collection("Cameras")
    c_luz = collection("Luzes")
    mats = build_materials()

    root = bpy.data.objects.new("Janela", None)
    root.empty_display_type = "PLAIN_AXES"
    root.empty_display_size = 0.2
    root["managed"] = True
    c_janela.objects.link(root)

    hw, hh = FRAME_W / 2, FRAME_H / 2
    shw, shh = SASH_W / 2, SASH_H / 2
    pivot = Vector((-shw, TURN_PIVOT_Y, 0.0))

    prof_marco = fillet_profile(PROFILE_MARCO, RAIOS_MARCO, SEGMENTOS_RAIO)
    prof_folha = fillet_profile(PROFILE_FOLHA, RAIOS_FOLHA, SEGMENTOS_RAIO)
    prof_ved = lambda p: fillet_profile(p, RAIO_VEDACAO, 1)  # noqa: E731

    # Marco fixo (sem dobradiças aparentes)
    lm = LoopMesh()
    lm.add_loop(hw, hh, prof_marco)
    make_object("Frame_Fixo", lm.to_mesh("Frame_Fixo", mats["estrutura"]), c_janela, root)

    # Vedação do marco: friso na face interna do vão
    lm = LoopMesh()
    lm.add_loop(hw, hh, prof_ved(PROFILE_VED_MARCO))
    make_object("Vedacao_Marco", lm.to_mesh("Vedacao_Marco", mats["vedacao"]), c_janela, root)

    # Pivô do oscilobatente: eixo horizontal (X) na aresta inferior da folha, do lado
    # para onde ela abre.
    tilt_pivot_world = Vector((0.0, TILT_PIVOT_Y, -shh))
    pivo_oscilo = bpy.data.objects.new("Pivo_Oscilobatente", None)
    pivo_oscilo.empty_display_type = "SINGLE_ARROW"
    pivo_oscilo.empty_display_size = 0.15
    pivo_oscilo["managed"] = True
    c_janela.objects.link(pivo_oscilo)
    pivo_oscilo.parent = root
    pivo_oscilo.location = tilt_pivot_world
    pivo_oscilo.rotation_mode = "XYZ"

    # Folha móvel = pivô do giro: eixo vertical (Z) na lateral das dobradiças.
    off = -pivot  # geometria construída no espaço da janela, deslocada para o pivô
    lm = LoopMesh()
    lm.add_loop(shw, shh, prof_folha, off)
    folha = make_object("Folha_Movel", lm.to_mesh("Folha_Movel", mats["estrutura"]),
                        c_janela, pivo_oscilo, location=pivot - tilt_pivot_world)
    folha.rotation_mode = "XYZ"

    bm = bmesh.new()
    gw, gh = shw - GLASS_INSET, shh - GLASS_INSET
    add_box(bm, off + Vector((0, (GLASS_Y0 + GLASS_Y1) / 2, 0)),
            (2 * gw, GLASS_Y1 - GLASS_Y0, 2 * gh))
    make_object("Vidro", finish_mesh("Vidro", bm, mats["vidro"]), c_janela, folha)

    lm = LoopMesh()
    for prof in (PROFILE_VED_VIDRO_FRENTE, PROFILE_VED_VIDRO_TRAS, PROFILE_VED_BORDA):
        lm.add_loop(shw, shh, prof_ved(prof), off)
    make_object("Vedacao_Folha", lm.to_mesh("Vedacao_Folha", mats["vedacao"]), c_janela, folha)

    # Maçaneta: roseta + haste + alavanca apontando para a dobradiça
    hx, hz = shw - HANDLE_INSET, -0.02
    front = SASH_Y0
    bm = bmesh.new()
    # espelho embutido 0,5 mm na folha (sem face coplanar com o perfil)
    add_box(bm, off + Vector((hx, front - 0.0045, hz)), (0.028, 0.010, 0.074))
    add_cylinder(bm, off + Vector((hx, front - 0.019, hz + 0.008)), 0.0075, 0.020, "Y", 20)
    mac = make_object("Macaneta", finish_mesh("Macaneta", bm, mats["macaneta"]),
                      c_janela, folha)
    add_bevel(mac, 0.003, 2, angle=60.0)
    # Alavanca separada, com origem no eixo da haste, para girar como no site.
    lever_pivot = Vector((hx, front - 0.033, hz + 0.008))
    bm = bmesh.new()
    add_box(bm, Vector((-0.050, 0, 0)), (0.112, 0.012, 0.0135))
    alavanca = make_object("Macaneta_Alavanca",
                           finish_mesh("Macaneta_Alavanca", bm, mats["macaneta"]),
                           c_janela, folha, location=off + lever_pivot)
    alavanca.rotation_mode = "XYZ"
    add_bevel(alavanca, 0.003, 2, angle=60.0)

    # ---------------------------------------------------------- animação
    # Uma linha do tempo única, controlável por scroll (quadro = progresso x 120).
    # Cada mecanismo tem seu pivô e fica em 0 enquanto o outro se move.
    F1, FO, F2, FG, F3 = F_FECHADA_1, F_OSCILO, F_FECHADA_2, F_GIRO, F_FECHADA_3
    keyframe_rot(pivo_oscilo, "Seq_Oscilobatente", 0,
                 [(F1, 0.0), (FO, TILT_ANGLE), (F2, 0.0), (FG, 0.0), (F3, 0.0)])
    keyframe_rot(folha, "Seq_Giro", 2,
                 [(F1, 0.0), (FO, 0.0), (F2, 0.0), (FG, -TURN_ANGLE), (F3, 0.0)])
    keyframe_rot(alavanca, "Seq_Alavanca", 1,
                 [(F1, LEVER_DOWN), (FO, LEVER_UP), (F2, LEVER_DOWN), (FG, LEVER_TURN),
                  (F3, LEVER_DOWN)])
    scene.name = SEQUENCE_NAME
    scene.frame_start, scene.frame_end = FRAME_START, FRAME_END
    scene.frame_set(FRAME_START)

    # ---------------------------------------------------------- câmera / luzes / mundo
    setup_preview(scene, c_cam, c_luz)
    return root


def keyframe_rot(ob, name, axis, keys):
    """Action em `ob` com keyframes de rotação num eixo e easing suave (sem overshoot)."""
    act = bpy.data.actions.new(name)
    ob.animation_data_create()
    ob.animation_data.action = act
    base = list(ob.rotation_euler)
    for frame, value in keys:
        rot = list(base)
        rot[axis] = value
        ob.rotation_euler = rot
        ob.keyframe_insert("rotation_euler", index=axis, frame=frame)
    act.use_fake_user = True
    for fc in _fcurves(act):
        for kp in fc.keyframe_points:
            kp.interpolation = "BEZIER"
            kp.easing = "AUTO"
            kp.handle_left_type = kp.handle_right_type = "AUTO_CLAMPED"
        fc.update()
    return act


def _fcurves(action):
    if hasattr(action, "fcurves") and len(getattr(action, "fcurves", [])):
        return list(action.fcurves)
    out = []
    for layer in getattr(action, "layers", []):
        for strip in layer.strips:
            for bag in strip.channelbags:
                out.extend(bag.fcurves)
    return out


def setup_preview(scene, c_cam, c_luz):
    cam_data = bpy.data.cameras.new("Camera_Preview")
    cam_data.lens = 32.0
    cam_data.sensor_fit = "HORIZONTAL"
    cam_data.sensor_width = 36.0
    cam_data.clip_start, cam_data.clip_end = 0.05, 50.0
    cam = bpy.data.objects.new("Camera_Preview", cam_data)
    c_cam.objects.link(cam)
    cam.location = (0.0, -3.12, 0.0)
    cam.rotation_euler = (math.radians(90), 0, 0)

    # Mesma perspectiva do site de referência (three.js: alvo + (-1.55, 0.35, 3.4), fov 28°).
    site_data = bpy.data.cameras.new("Camera_Site")
    site_data.sensor_fit = "VERTICAL"
    site_data.sensor_height = 24.0
    site_data.lens = 12.0 / math.tan(math.radians(28) / 2)
    site_data.clip_start, site_data.clip_end = 0.05, 50.0
    site = bpy.data.objects.new("Camera_Site", site_data)
    c_cam.objects.link(site)
    site.location = (-1.55, -3.4, 0.35)
    site.rotation_euler = (Vector((0, 0, 0)) - site.location).to_track_quat("-Z", "Y").to_euler()
    scene.camera = site
    scene.render.resolution_x, scene.render.resolution_y = 1080, 1200

    def light(name, kind, loc, energy, size, color=(1, 1, 1)):
        ld = bpy.data.lights.new(name, kind)
        ld.energy = energy
        ld.color = color
        if kind == "AREA":
            ld.shape = "DISK"
            ld.size = size
        else:
            ld.angle = size
        ob = bpy.data.objects.new(name, ld)
        c_luz.objects.link(ob)
        ob.location = loc
        target = Vector((0, 0, 0))
        ob.rotation_euler = (target - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
        return ob

    light("Luz_Key", "AREA", (-2.2, -2.6, 2.4), 95.0, 2.5, (1.0, 0.985, 0.965))
    light("Luz_Fill", "AREA", (2.6, -2.2, 0.6), 45.0, 3.0, (0.97, 0.985, 1.0))
    light("Luz_Rim", "AREA", (0.5, 2.5, 2.0), 60.0, 2.0)

    world = bpy.data.worlds.new("Fundo_Neutro")
    scene.world = world
    nt = world.node_tree
    nodes, links = nt.nodes, nt.links
    for n in list(nodes):
        nodes.remove(n)
    out = nodes.new("ShaderNodeOutputWorld")
    mix = nodes.new("ShaderNodeMixShader")
    bg_cam = nodes.new("ShaderNodeBackground")       # o que a câmera vê: branco limpo
    bg_cam.inputs["Color"].default_value = (1, 1, 1, 1)
    bg_cam.inputs["Strength"].default_value = 1.0
    bg_env = nodes.new("ShaderNodeBackground")       # o que ilumina/reflete: gradiente suave
    bg_env.inputs["Strength"].default_value = 0.26
    ramp = nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.35
    ramp.color_ramp.elements[0].color = (0.42, 0.42, 0.43, 1)
    ramp.color_ramp.elements[1].position = 0.75
    ramp.color_ramp.elements[1].color = (1.0, 1.0, 1.0, 1)
    coord = nodes.new("ShaderNodeTexCoord")
    sep = nodes.new("ShaderNodeSeparateXYZ")
    remap = nodes.new("ShaderNodeMapRange")          # z de [-1,1] para [0,1]
    remap.inputs["From Min"].default_value = -1.0
    lp = nodes.new("ShaderNodeLightPath")
    links.new(coord.outputs["Generated"], sep.inputs[0])
    links.new(sep.outputs["Z"], remap.inputs["Value"])
    links.new(remap.outputs["Result"], ramp.inputs["Fac"])
    links.new(ramp.outputs["Color"], bg_env.inputs["Color"])
    see_through = nodes.new("ShaderNodeMath")       # câmera ou através do vidro: fundo branco
    see_through.operation = "MAXIMUM"
    see_through.use_clamp = True
    links.new(lp.outputs["Is Camera Ray"], see_through.inputs[0])
    links.new(lp.outputs["Is Transmission Ray"], see_through.inputs[1])
    links.new(see_through.outputs[0], mix.inputs["Fac"])
    links.new(bg_env.outputs[0], mix.inputs[1])
    links.new(bg_cam.outputs[0], mix.inputs[2])
    links.new(mix.outputs[0], out.inputs["Surface"])

    scene.view_settings.view_transform = "Standard"
    scene.view_settings.look = "None"
    scene.view_settings.exposure = 0.0
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 48
    scene.cycles.use_denoising = True
    scene.cycles.blur_glossy = 1.0


def check_states():
    """Amostra todos os quadros: oscilobatente e giro nunca abertos ao mesmo tempo."""
    scene = bpy.context.scene
    pivo = bpy.data.objects["Pivo_Oscilobatente"]
    folha = bpy.data.objects["Folha_Movel"]
    lever = bpy.data.objects["Macaneta_Alavanca"]
    eps = math.radians(0.01)
    overlap = []
    for f in range(FRAME_START, FRAME_END + 1):
        scene.frame_set(f)
        if abs(pivo.rotation_euler.x) > eps and abs(folha.rotation_euler.z) > eps:
            overlap.append(f)
    if overlap:
        raise RuntimeError(f"oscilo e giro abertos juntos nos quadros {overlap}")
    states = {}
    for label, f in (("fechada_1", F_FECHADA_1), ("oscilobatente", F_OSCILO),
                     ("fechada_2", F_FECHADA_2), ("giro", F_GIRO), ("fechada_3", F_FECHADA_3)):
        scene.frame_set(f)
        states[label] = {"quadro": f,
                         "oscilo_graus": round(math.degrees(pivo.rotation_euler.x), 3),
                         "giro_graus": round(math.degrees(folha.rotation_euler.z), 3),
                         "alavanca_graus": round(math.degrees(lever.rotation_euler.y), 3)}
    scene.frame_set(FRAME_START)
    return states


def validate():
    names = ["Janela", "Frame_Fixo", "Vedacao_Marco", "Folha_Movel",
             "Vidro", "Vedacao_Folha", "Macaneta", "Macaneta_Alavanca",
             "Pivo_Oscilobatente", "Camera_Preview", "Camera_Site"]
    missing = [n for n in names if n not in bpy.data.objects]
    if missing:
        raise RuntimeError(f"objetos ausentes: {missing}")
    dg = bpy.context.evaluated_depsgraph_get()
    report = {}
    total = 0
    for ob in bpy.data.objects:
        if ob.type != "MESH":
            continue
        me = ob.evaluated_get(dg).to_mesh()
        me.calc_loop_triangles()
        tris = len(me.loop_triangles)
        ob.evaluated_get(dg).to_mesh_clear()
        total += tris
        report[ob.name] = {"tris": tris, "parent": ob.parent.name if ob.parent else None,
                           "material": ob.data.materials[0].name}
    folha = bpy.data.objects["Folha_Movel"]
    report["_folha_pivot"] = [round(v, 4) for v in folha.location]
    report["_total_tris"] = total
    report["_actions"] = sorted(a.name for a in bpy.data.actions)
    report["_estados"] = check_states()
    return report


root = build()
rep = validate()
out = Path(args.out).resolve()
out.parent.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(out), compress=True)
print("REPORT " + json.dumps(rep))
