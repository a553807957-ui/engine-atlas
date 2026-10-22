import math
W,H,CX=520,370,260
COLORS=["#ff5f3d","#ffa62b","#ffe066","#9be564","#38d6b0","#4cc9f0","#7aa2ff","#b18bff"]

def render(name, banks, crank_y=250, note="", crank_span=(70,450)):
    """banks: list of (angle_deg_from_vertical, n, lateral_offset_px, spacing_px, radius_px, color_index)"""
    els=[]
    for (ang,n,lat,sp,r,ci) in banks:
        a=math.radians(ang)
        dx,dy=math.sin(a),-math.cos(a)          # direction from crank outward
        nx,ny=math.cos(a),math.sin(a)            # normal (lateral) direction
        for i in range(n):
            d=38+i*sp
            px=CX+dx*d+nx*lat
            py=crank_y+dy*d+ny*lat
            els.append(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="{r}" fill="{COLORS[(i+ci)%8]}" stroke="#080b11" stroke-width="3"/>')
    head=(f'<line x1="{crank_span[0]}" y1="{crank_y}" x2="{crank_span[1]}" y2="{crank_y}" stroke="#2f394d" stroke-width="14" stroke-linecap="round"/>'
          f'<circle cx="{CX}" cy="{crank_y}" r="13" fill="#080b11" stroke="#39435a" stroke-width="3"/>'
          f'<line x1="{CX-20}" y1="{crank_y+22}" x2="{CX+20}" y2="{crank_y+22}" stroke="#39435a" stroke-width="3" stroke-linecap="round"/>')
    svg=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid meet">',head]+els
    if note: svg.append(f'<text x="{CX}" y="{H-14}" font-size="17" fill="#8a94a6" text-anchor="middle" font-family="-apple-system,PingFang SC,Noto Sans SC,sans-serif">{note}</text>')
    svg.append('</svg>')
    open(f"assets/layouts/{name}.svg","w").write("\n".join(svg))

for n in (5,6,8):
    render(f"inline-{n}", [(0,n,0,46,21,0)], crank_y=262, note=f"直列 {n} 缸 · 一列，一根曲轴")
for n,ang in ((6,60),(8,90),(10,90),(12,60)):
    render(f"v-{n}", [(ang/2,n//2,0,44,20,0),(-ang/2,n//2,0,44,20,4)], note=f"{ang}° V{n} · 两列，夹角 {ang}°")
render("v-16", [(22.5,8,0,34,15,0),(-22.5,8,0,34,15,4)], note="45° V16 · 两列，每列 8 缸")
render("vr6", [(7.5,3,17,52,17,0),(-7.5,3,17,52,17,4)], note="15° VR6 · 两列交错，共用一个缸盖")
render("x-16", [(45,4,0,42,17,0),(-45,4,0,42,17,4),(135,4,0,42,17,2),(225,4,0,42,17,6)], crank_y=205, note="X16 · 两台 90° V8 共用一根曲轴")
render("w-12", [(43,3,22,40,16,0),(29,3,-22,40,16,4),(-43,3,22,40,16,2),(-29,3,-22,40,16,6)], note="W12 · 两列 15° VR6 以 72° 相交")
render("w-16", [(46,4,24,38,15,0),(26,4,-24,38,15,4),(-46,4,24,38,15,2),(-26,4,-24,38,15,6)], note="W16 · 四排气缸，共用一根曲轴")
print("ok")
