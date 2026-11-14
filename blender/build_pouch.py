"""Build the Jewar Everyday Basmati Rice pouch (stand-up pouch / doypack).

Run headless (no GPU needed):

    blender -b -P blender/build_pouch.py -- \
        --front assets/reference/01-front-texture.png \
        --back assets/reference/02-back-texture.png \
        --out blender/out/pouch-raw.glb

Outputs:
    blender/out/pouch-raw.glb          raw model (git-ignored)
    blender/previews/*.png             front, three-quarter, side, back, below
    public/images/pouch-front.webp     transparent front render

Model rules:
    - Real scale, metres.
    - Origin at the bottom-centre of the pouch.
    - Front faces +Z in three.js (Blender -Y, converted by the glTF exporter).
"""

import math
import shutil
import subprocess
import sys
from pathlib import Path

import bmesh
import bpy
from mathutils import Vector

# --------------------------------------------------------------------------
# Sizes (all in metres) and settings. Change numbers here, not below.
# --------------------------------------------------------------------------
PANEL_WIDTH = 0.18  # front panel width
PANEL_HEIGHT = 0.29  # front panel height
GUSSET_DEPTH = 0.09  # bottom gusset depth (front to back at the base)
GUSSET_HEIGHT = 0.11  # how far up the gusset flare reaches
PUFF = 0.036  # how far each panel bulges out in the middle (half thickness)
PUFF_HEIGHT_VARIATION = 0.15  # 0 = same puff all the way up; 1 = puff closes at both ends
PUFF_WIDTH_POWER = 2.0  # across the width (higher = flatter middle, sharper sides)
GUSSET_POWER = 0.8  # shape of the base outline (lower = squarer)
TOP_SEAL = 0.015  # flat heat-seal strip at the top
SIDE_SEAL = 0.008  # flat thin seals at the sides
TOP_RAMP = 0.02  # distance over which the puff grows after the top seal
SIDE_RAMP = 0.03  # distance over which the puff grows after the side seal
SEAL_GAP = 0.0006  # half gap between the two sheets in a flat seal (stops z-fighting)
SEAL_GAP_RAMP = 0.004  # distance from the very edge where the gap is reached
CORNER_RADIUS = 0.012  # rounded corners (all four)

GRID_X = 36  # quads across each panel
GRID_Z = 60  # quads up each panel

# Rice window on the front texture (pixels, origin top-left, 1692x2733 image).
TEX_W, TEX_H = 1692, 2733
WINDOW_X0, WINDOW_X1 = 365, 1300
WINDOW_Y0, WINDOW_Y1 = 1890, 2325
WINDOW_CORNER_PX = 90
ROUGH_MAP_W, ROUGH_MAP_H = 128, 207  # small roughness map
ROUGH_PAPER = 0.75
ROUGH_WINDOW = 0.35

CREAM_HEX = "FDF8F4"

# Renders (Cycles, CPU only).
RENDER_SAMPLES = 64
RENDER_W, RENDER_H = 800, 1000
CAMERA_DISTANCE = 1.0
CAMERA_LENS_MM = 85
BACKDROP_HEX = "EFE4D6"
WORLD_STRENGTH = 0.5
FLOOR_DIFFUSE = 0.2  # how much of the backdrop colour the floor reflects
FLOOR_GLOW = 0.35  # floor emission, tuned so the floor matches the world colour
KEY_W, FILL_W, RIM_W = 20, 8, 8  # light power (W)
VIEWS = {
    # name: (azimuth deg, elevation deg)
    "front": (0, 4),
    "three-quarter": (35, 12),
    "side": (90, 4),
    "back": (180, 4),
    "below": (25, -38),
}

ROOT = Path(__file__).resolve().parent.parent


# --------------------------------------------------------------------------
# Small helpers
# --------------------------------------------------------------------------
def get_args():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    opts = {
        "front": ROOT / "assets/reference/01-front-texture.png",
        "back": ROOT / "assets/reference/02-back-texture.png",
        "out": ROOT / "blender/out/pouch-raw.glb",
        "previews": ROOT / "blender/previews",
        "webp": ROOT / "public/images/pouch-front.webp",
    }
    opts["only"] = None  # e.g. --only front: render just one view (fast tests)
    it = iter(argv)
    for flag in it:
        key = flag.lstrip("-")
        if key == "only":
            opts["only"] = next(it)
        elif key in opts:
            opts[key] = Path(next(it)).resolve()
    return opts


def srgb_to_linear(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def hex_to_linear(h):
    return tuple(srgb_to_linear(int(h[i : i + 2], 16) / 255) for i in (0, 2, 4)) + (1.0,)


def smoothstep(a, b, x):
    t = max(0.0, min(1.0, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)


# --------------------------------------------------------------------------
# Geometry
# --------------------------------------------------------------------------
def half_thickness(x, z):
    """How far the front panel sits in front of the centre plane at (x, z).

    The back panel is the mirror (+y). It is 0 at the top and side edges, so
    the panels meet there. At the bottom it opens up to GUSSET_DEPTH / 2.
    """
    hw = PANEL_WIDTH / 2
    u = min(1.0, abs(x) / hw)
    edge_x = hw - abs(x)
    edge_top = PANEL_HEIGHT - z

    # Middle puff: none in the seals, grows after them, closes at the bottom.
    ramp = smoothstep(TOP_SEAL, TOP_SEAL + TOP_RAMP, edge_top) * smoothstep(
        SIDE_SEAL, SIDE_SEAL + SIDE_RAMP, edge_x
    )
    v = max(0.0, min(1.0, z / (PANEL_HEIGHT - TOP_SEAL)))
    height_shape = (1 - PUFF_HEIGHT_VARIATION) + PUFF_HEIGHT_VARIATION * math.sin(math.pi * v)
    puff = PUFF * (1 - u**PUFF_WIDTH_POWER) * height_shape * ramp

    # Gusset: the base is boat-shaped and flares up into the panels.
    gus = (
        (GUSSET_DEPTH / 2)
        * max(0.0, 1 - u * u) ** GUSSET_POWER
        * (1 - smoothstep(0.0, GUSSET_HEIGHT, z))
    )

    body = (gus**6 + puff**6) ** (1 / 6)  # smooth union: base flares into the body

    # Tiny gap in the flat seals so the two sheets never overlap exactly.
    gap = SEAL_GAP * min(1.0, min(edge_x, edge_top) / SEAL_GAP_RAMP)
    return body + gap


def round_corner(x, z):
    """Pull the four corners into quarter circles (in the panel plane)."""
    r = CORNER_RADIUS
    hw = PANEL_WIDTH / 2
    cx = hw - r
    for cz in (r, PANEL_HEIGHT - r):
        dx = abs(x) - cx
        dz = z - cz
        in_corner = dx > 0 and ((dz < 0) if cz == r else (dz > 0))
        if in_corner:
            m = max(abs(dx), abs(dz))
            d = math.hypot(dx, dz)
            k = m / d if d > 0 else 1.0
            x = math.copysign(cx + dx * k, x)
            z = cz + dz * k
    return x, z


def build_mesh():
    mesh = bpy.data.meshes.new("PouchMesh")
    bm = bmesh.new()
    uv_layer = bm.loops.layers.uv.new("UVMap")

    nx, nz = GRID_X, GRID_Z
    front, back = {}, {}
    pos = {}  # (i, j) -> (x, z, t) for UVs
    for j in range(nz + 1):
        for i in range(nx + 1):
            x0 = (i / nx - 0.5) * PANEL_WIDTH
            z0 = (j / nz) * PANEL_HEIGHT
            t = half_thickness(x0, z0)
            if i in (0, nx) or j == nz:
                t = 0.0  # exact edge: panels share these vertices
            x, z = round_corner(x0, z0)
            pos[(i, j)] = (x0, z0)
            front[(i, j)] = bm.verts.new((x, -t, z))
            if i in (0, nx) or j == nz:
                back[(i, j)] = front[(i, j)]  # shared edge: no gap
            else:
                back[(i, j)] = bm.verts.new((x, t, z))
    bm.verts.ensure_lookup_table()

    def set_uv(face, uvs):
        for loop, uv in zip(face.loops, uvs):
            loop[uv_layer].uv = uv

    for j in range(nz):
        for i in range(nx):
            ring = [(i, j), (i + 1, j), (i + 1, j + 1), (i, j + 1)]
            uvs_front = []
            uvs_back = []
            for ij in ring:
                x0, z0 = pos[ij]
                u = x0 / PANEL_WIDTH + 0.5
                v = z0 / PANEL_HEIGHT
                uvs_front.append((u, v))
                uvs_back.append((1 - u, v))  # back is seen from behind: mirror
            f = bm.faces.new([front[ij] for ij in ring])
            f.material_index = 0
            set_uv(f, uvs_front)
            # Back panel: same ring, reversed so the normal faces +Y.
            rb = list(reversed(ring))
            g = bm.faces.new([back[ij] for ij in rb])
            g.material_index = 1
            set_uv(g, list(reversed(uvs_back)))

    # Bottom: strip between the front and back bottom edges (flat base).
    for i in range(nx):
        quad = [back[(i, 0)], back[(i + 1, 0)], front[(i + 1, 0)], front[(i, 0)]]
        verts = []
        for v in quad:
            if v not in verts:
                verts.append(v)
        if len(verts) < 3:
            continue
        f = bm.faces.new(verts)
        f.material_index = 2
        set_uv(f, [(0.5, 0.5)] * len(verts))

    # Sharp edges where panels fold hard (seals, base); smooth elsewhere.
    bm.normal_update()
    for e in bm.edges:
        if len(e.link_faces) == 2:
            if e.calc_face_angle(0.0) > math.radians(50):
                e.smooth = False
    for f in bm.faces:
        f.smooth = True

    # Watertight check: every edge must touch exactly two faces.
    bad = [e for e in bm.edges if len(e.link_faces) != 2]
    tris = sum(len(f.verts) - 2 for f in bm.faces)
    print(f"[pouch] verts={len(bm.verts)} faces={len(bm.faces)} tris={tris}")
    print(f"[pouch] open/non-manifold edges: {len(bad)}")
    if bad:
        raise SystemExit("Mesh has gaps. Fix the geometry.")

    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new("Pouch", mesh)
    bpy.context.scene.collection.objects.link(obj)
    return obj


# --------------------------------------------------------------------------
# Materials
# --------------------------------------------------------------------------
def make_roughness_map():
    """Small greyscale map: paper everywhere, glossier rice window.

    Channels follow glTF: G = roughness, B = metallic (0), R unused.
    """
    img = bpy.data.images.new("PouchRoughness", ROUGH_MAP_W, ROUGH_MAP_H, alpha=False)
    img.colorspace_settings.name = "Non-Color"
    px = []
    cr = WINDOW_CORNER_PX
    for row in range(ROUGH_MAP_H):  # row 0 = bottom
        y_tex = (1 - (row + 0.5) / ROUGH_MAP_H) * TEX_H
        for col in range(ROUGH_MAP_W):
            x_tex = ((col + 0.5) / ROUGH_MAP_W) * TEX_W
            inside = WINDOW_X0 <= x_tex <= WINDOW_X1 and WINDOW_Y0 <= y_tex <= WINDOW_Y1
            if inside:  # round the window corners
                dx = max(WINDOW_X0 + cr - x_tex, x_tex - (WINDOW_X1 - cr), 0)
                dy = max(WINDOW_Y0 + cr - y_tex, y_tex - (WINDOW_Y1 - cr), 0)
                inside = math.hypot(dx, dy) <= cr
            r = ROUGH_WINDOW if inside else ROUGH_PAPER
            px += [1.0, r, 0.0, 1.0]
    img.pixels = px
    img.pack()
    return img


def make_material(name, base_color=None, image_path=None, rough_img=None):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    mat.use_backface_culling = True
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    bsdf.inputs["Metallic"].default_value = 0.0
    bsdf.inputs["Roughness"].default_value = ROUGH_PAPER
    bsdf.inputs["Specular IOR Level"].default_value = 0.3

    if image_path:
        tex = nt.nodes.new("ShaderNodeTexImage")
        tex.image = bpy.data.images.load(str(image_path))
        tex.image.colorspace_settings.name = "sRGB"
        tex.extension = "EXTEND"
        nt.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
    else:
        bsdf.inputs["Base Color"].default_value = base_color

    if rough_img:
        rtex = nt.nodes.new("ShaderNodeTexImage")
        rtex.image = rough_img
        rtex.extension = "EXTEND"
        sep = nt.nodes.new("ShaderNodeSeparateColor")
        nt.links.new(rtex.outputs["Color"], sep.inputs["Color"])
        nt.links.new(sep.outputs["Green"], bsdf.inputs["Roughness"])
    return mat


# --------------------------------------------------------------------------
# Export
# --------------------------------------------------------------------------
def export_glb(obj, out_path):
    out_path.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.export_scene.gltf(
        filepath=str(out_path),
        export_format="GLB",
        use_selection=True,
        export_yup=True,
        export_apply=True,
        export_materials="EXPORT",
        export_image_format="AUTO",
        export_cameras=False,
        export_lights=False,
    )
    print(f"[pouch] wrote {out_path} ({out_path.stat().st_size / 1024:.0f} KB)")


# --------------------------------------------------------------------------
# Preview renders
# --------------------------------------------------------------------------
def setup_render():
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.samples = RENDER_SAMPLES
    scene.cycles.use_denoising = True
    scene.cycles.denoiser = "OPENIMAGEDENOISE"
    scene.render.resolution_x = RENDER_W
    scene.render.resolution_y = RENDER_H
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.view_settings.view_transform = "Standard"
    scene.view_settings.look = "None"

    world = bpy.data.worlds.new("World")
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = hex_to_linear(BACKDROP_HEX)
    bg.inputs["Strength"].default_value = WORLD_STRENGTH
    scene.world = world

    # Floor (shadow catcher in the transparent render).
    bpy.ops.mesh.primitive_plane_add(size=30, location=(0, 0, 0))
    floor = bpy.context.active_object
    floor.name = "Floor"
    fm = bpy.data.materials.new("Floor")
    fm.use_nodes = True
    fb = fm.node_tree.nodes["Principled BSDF"]
    # Mostly emissive so the floor blends into the backdrop; a little diffuse
    # keeps the soft contact shadow.
    fb.inputs["Base Color"].default_value = tuple(
        c * FLOOR_DIFFUSE for c in hex_to_linear(BACKDROP_HEX)[:3]
    ) + (1.0,)
    fb.inputs["Roughness"].default_value = 1.0
    fb.inputs["Emission Color"].default_value = hex_to_linear(BACKDROP_HEX)
    fb.inputs["Emission Strength"].default_value = FLOOR_GLOW
    floor.data.materials.append(fm)

    # Camera rig: rig_z turns around the pouch, rig_x tilts up/down.
    target = Vector((0, 0, PANEL_HEIGHT / 2))
    rig_z = bpy.data.objects.new("RigZ", None)
    rig_z.location = target
    scene.collection.objects.link(rig_z)
    rig_x = bpy.data.objects.new("RigX", None)
    rig_x.parent = rig_z
    scene.collection.objects.link(rig_x)

    cam_data = bpy.data.cameras.new("Cam")
    cam_data.lens = CAMERA_LENS_MM
    cam = bpy.data.objects.new("Cam", cam_data)
    cam.parent = rig_x
    cam.location = (0, -CAMERA_DISTANCE, 0)
    cam.rotation_euler = (math.radians(90), 0, 0)
    scene.collection.objects.link(cam)
    scene.camera = cam

    def add_light(name, loc, size, energy):
        data = bpy.data.lights.new(name, "AREA")
        data.shape = "SQUARE"
        data.size = size
        data.energy = energy
        light = bpy.data.objects.new(name, data)
        light.parent = rig_x
        light.location = loc
        scene.collection.objects.link(light)
        track = light.constraints.new("TRACK_TO")
        track.target = rig_x
        track.track_axis = "TRACK_NEGATIVE_Z"
        track.up_axis = "UP_Y"
        return light

    add_light("Key", (-0.7, -0.8, 0.6), 0.9, KEY_W)
    add_light("Fill", (0.8, -0.7, 0.1), 1.2, FILL_W)
    add_light("Rim", (0.4, 0.8, 0.5), 0.6, RIM_W)
    return floor, rig_z, rig_x


def render_views(floor, rig_z, rig_x, previews_dir, webp_path, only=None):
    scene = bpy.context.scene
    previews_dir.mkdir(parents=True, exist_ok=True)

    for name, (az, el) in VIEWS.items():
        if only and name != only:
            continue
        rig_z.rotation_euler = (0, 0, math.radians(az))
        rig_x.rotation_euler = (math.radians(-el), 0, 0)
        floor.hide_render = name == "below"  # no floor when looking from below
        scene.render.film_transparent = False
        scene.render.filepath = str(previews_dir / f"{name}.png")
        bpy.ops.render.render(write_still=True)
        print(f"[pouch] rendered {name}")

    # Transparent front render for the loading / no-WebGL image.
    az, el = VIEWS["front"]
    rig_z.rotation_euler = (0, 0, math.radians(az))
    rig_x.rotation_euler = (math.radians(-el), 0, 0)
    floor.hide_render = False
    floor.is_shadow_catcher = True
    scene.render.film_transparent = True
    tmp = previews_dir / "_front-transparent.png"
    scene.render.filepath = str(tmp)
    bpy.ops.render.render(write_still=True)
    webp_path.parent.mkdir(parents=True, exist_ok=True)
    if shutil.which("cwebp"):
        subprocess.run(
            ["cwebp", "-q", "88", "-alpha_q", "95", str(tmp), "-o", str(webp_path)],
            check=True,
            capture_output=True,
        )
        print(f"[pouch] wrote {webp_path}")
    else:
        print("[pouch] cwebp not found; skipped pouch-front.webp")
    tmp.unlink()


# --------------------------------------------------------------------------
def main():
    opts = get_args()
    bpy.ops.wm.read_factory_settings(use_empty=True)

    obj = build_mesh()
    rough = make_roughness_map()
    obj.data.materials.append(
        make_material("Front", image_path=opts["front"], rough_img=rough)
    )
    obj.data.materials.append(make_material("Back", image_path=opts["back"]))
    obj.data.materials.append(make_material("Cream", base_color=hex_to_linear(CREAM_HEX)))

    export_glb(obj, opts["out"])

    floor, rig_z, rig_x = setup_render()
    render_views(floor, rig_z, rig_x, opts["previews"], opts["webp"], opts["only"])


main()
