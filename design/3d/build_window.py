# Janela oscilo-batente ilustrativa (não é desenho técnico Perfect). Blender headless.
import bpy, bmesh, json, sys
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:]
out_glb = argv[0]

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

def material(name, color, rough, metal=0.0, alpha=1.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if alpha < 1:
        b.inputs["Alpha"].default_value = alpha
        b.inputs["Transmission Weight"].default_value = 1.0
        b.inputs["IOR"].default_value = 1.5
    return m

PVC = material("PVC_Graphite", (0.032, 0.040, 0.046), 0.42)
GLASS = material("Glass", (0.80, 0.88, 0.92), 0.02, 0.0, 0.25)
METAL = material("Handle_Metal", (0.75, 0.76, 0.78), 0.28, 1.0)
GASKET = material("Gasket", (0.01, 0.01, 0.012), 0.8)

def ring(name, ow, oh, face, depth, y0, mat, bevel=0.004):
    """Moldura retangular (vão interno) com cantos em meia-esquadria, extrudada em Y."""
    bm = bmesh.new()
    iw, ih = ow - 2 * face, oh - 2 * face
    outer = [(-ow/2, 0), (ow/2, 0), (ow/2, oh), (-ow/2, oh)]
    inner = [(-iw/2, face), (iw/2, face), (iw/2, face + ih), (-iw/2, face + ih)]
    vo = [bm.verts.new((x, 0, z)) for x, z in outer]
    vi = [bm.verts.new((x, 0, z)) for x, z in inner]
    for i in range(4):
        j = (i + 1) % 4
        bm.faces.new((vo[i], vo[j], vi[j], vi[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    ext = bmesh.ops.extrude_face_region(bm, geom=bm.faces[:])
    verts = [e for e in ext["geom"] if isinstance(e, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, verts=verts, vec=(0, depth, 0))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me)
    scene.collection.objects.link(ob)
    ob.location.y = y0
    ob.data.materials.append(mat)
    mod = ob.modifiers.new("bevel", "BEVEL")
    mod.width = bevel; mod.segments = 3; mod.limit_method = "ANGLE"
    return ob

def box(name, size, loc, mat, bevel=0.002):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    ob = bpy.context.active_object
    ob.name = name
    ob.scale = size
    bpy.ops.object.transform_apply(scale=True)
    ob.data.materials.append(mat)
    if bevel:
        mod = ob.modifiers.new("bevel", "BEVEL"); mod.width = bevel; mod.segments = 2
    return ob

W, H = 1.10, 1.40
FACE, DEPTH = 0.068, 0.070
SASH_FACE, SASH_DEPTH = 0.082, 0.078
GAP = 0.004

frame = ring("Frame", W, H, FACE, DEPTH, 0.0, PVC, 0.005)
# Segunda moldura interna (encosto) para dar leitura de perfil em camadas.
stop = ring("Frame_Stop", W - 2 * FACE + 0.02, H - 2 * FACE + 0.02, 0.012, 0.018, DEPTH - 0.018, GASKET, 0.0015)
stop.location.z = FACE - 0.01

sw, sh = W - 2 * FACE - 2 * GAP + 0.03, H - 2 * FACE - 2 * GAP + 0.03
sash_z0 = FACE + GAP - 0.015
sash_y = -0.012

tilt = bpy.data.objects.new("Tilt_Pivot", None)
scene.collection.objects.link(tilt)
tilt.location = (0, sash_y, sash_z0)
turn = bpy.data.objects.new("Turn_Pivot", None)
scene.collection.objects.link(turn)
turn.parent = tilt
turn.location = (-sw / 2, 0, 0)

def attach(ob):
    world = ob.matrix_world.copy()
    ob.parent = turn
    ob.matrix_parent_inverse = turn.matrix_world.inverted()
    ob.matrix_world = world

bpy.context.view_layer.update()
sash = ring("Sash", sw, sh, SASH_FACE, SASH_DEPTH, sash_y, PVC, 0.006)
sash.location.z = sash_z0
gw, gh = sw - 2 * SASH_FACE + 0.02, sh - 2 * SASH_FACE + 0.02
glass = box("Glass", (gw, 0.024, gh), (0, sash_y + SASH_DEPTH / 2, sash_z0 + SASH_FACE - 0.01 + gh / 2), GLASS, 0)
gasket = ring("Sash_Gasket", gw + 0.004, gh + 0.004, 0.008, 0.032, sash_y + SASH_DEPTH / 2 - 0.016, GASKET, 0.001)
gasket.location.z = sash_z0 + SASH_FACE - 0.012
hx = sw / 2 - SASH_FACE / 2
hz = sash_z0 + sh * 0.5
rose = box("Handle_Rose", (0.032, 0.012, 0.075), (hx, sash_y - 0.006, hz), METAL, 0.004)
lever = box("Handle_Lever", (0.018, 0.016, 0.14), (hx, sash_y - 0.026, hz - 0.055), METAL, 0.006)
for ob in (sash, glass, gasket, rose, lever):
    bpy.context.view_layer.update()
    attach(ob)

# Aplica modificadores para o GLB ficar leve e previsível.
dg = bpy.context.evaluated_depsgraph_get()
for ob in [o for o in scene.objects if o.type == "MESH"]:
    me = bpy.data.meshes.new_from_object(ob.evaluated_get(dg))
    ob.modifiers.clear()
    old = ob.data
    ob.data = me
    bpy.data.meshes.remove(old)
    for p in ob.data.polygons:
        p.use_smooth = True

bpy.ops.export_scene.gltf(filepath=out_glb, export_format="GLB", export_apply=True,
                          export_yup=True, export_materials="EXPORT")
tris = sum(len(o.data.polygons) for o in scene.objects if o.type == "MESH")
print(json.dumps({"ok": True, "objects": [o.name for o in scene.objects], "faces": tris}))
