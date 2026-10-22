#!/bin/sh
# push-via-api.sh — 在 github.com 被墙的环境下，用 GitHub REST API 逐文件推送
# 用法: GITHUB_TOKEN=xxx sh push-via-api.sh [owner] [repo] [branch]
set -e

OWNER="${1:-a553807957-ui}"
REPO="${2:-engine-atlas}"
BRANCH="${3:-main}"
[ -n "$GITHUB_TOKEN" ] || { echo "缺少 GITHUB_TOKEN"; exit 1; }

API="https://api.github.com"
AUTH="Authorization: Bearer $GITHUB_TOKEN"
UA="User-Agent: engine-atlas-pusher"

echo "== 校验身份 =="
login=$(curl -sS -H "$AUTH" -H "$UA" "$API/user" | python3 -c "import json,sys;print(json.load(sys.stdin).get('login',''))")
[ -n "$login" ] || { echo "token 无效"; exit 1; }
echo "登录为: $login"
[ "$login" = "$OWNER" ] || echo "警告: token 属于 $login，并非目标 owner $OWNER"

echo "== 检查仓库 =="
curl -sS -H "$AUTH" -H "$UA" "$API/repos/$OWNER/$REPO" \
  | python3 -c "import json,sys;d=json.load(sys.stdin);print('仓库:',d.get('full_name'),'| private:',d.get('private'),'| size:',d.get('size'))"

echo "== 收集文件（跳过 .git）=="
python3 - "$OWNER" "$REPO" "$BRANCH" <<'PY'
import base64, json, os, subprocess, sys, urllib.request, urllib.error

owner, repo, branch = sys.argv[1:4]
token = os.environ["GITHUB_TOKEN"]
API = "https://api.github.com"
SKIP_DIRS = {".git", "node_modules", ".DS_Store"}

def api(method, path, body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(
        API + path, data=data, method=method,
        headers={
            "Authorization": "Bearer " + token,
            "Accept": "application/vnd.github+json",
            "User-Agent": "engine-atlas-pusher",
            "Content-Type": "application/json",
        })
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            raw = r.read()
            return json.loads(raw) if raw.strip() else {}
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="ignore")[:300]
        print("  HTTP", e.code, path, body)
        return {"error": e.code}

files = []
for root, dirs, names in os.walk("."):
    dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
    for n in names:
        p = os.path.join(root, n).replace("./", "", 1)
        if n == ".DS_Store":
            continue
        # token 若没有 workflow 权限，.github/workflows/* 会被网关拒绝（404）
        if ".github/workflows" in p.replace("\\", "/"):
            print("  跳过（需 workflow 权限）:", p)
            continue
        files.append(p)
files.sort()
print(f"共 {len(files)} 个文件")

# 1) 基础分支：如果仓库是空的，先建一个空提交
ref = api("GET", f"/repos/{owner}/{repo}/git/ref/heads/{branch}")
if ref.get("error") in (404, 409) or "object" not in ref:
    print("仓库为空，创建初始提交…")
    tree = api("POST", f"/repos/{owner}/{repo}/git/trees", {"tree": []})
    commit = api("POST", f"/repos/{owner}/{repo}/git/commits",
                 {"message": "init", "tree": tree["sha"], "parents": []})
    api("POST", f"/repos/{owner}/{repo}/git/refs",
        {"ref": f"refs/heads/{branch}", "sha": commit["sha"]})
    base_sha = commit["sha"]
    base_tree = None
else:
    base_sha = ref["object"]["sha"]
    base_tree = None   # 直接建一棵完整的新 tree
print("基础提交:", base_sha[:10])

# 2) 逐个文件创建 blob，最后一次性提交（避免 N 次提交）
tree_entries = []
for i, path in enumerate(files, 1):
    with open(path, "rb") as fh:
        content = fh.read()
    blob = api("POST", f"/repos/{owner}/{repo}/git/blobs",
               {"content": base64.b64encode(content).decode(), "encoding": "base64"})
    if "sha" not in blob:
        print("  失败:", path)
        continue
    mode = "100755" if path.endswith(".sh") else "100644"
    tree_entries.append({"path": path, "mode": mode, "type": "blob", "sha": blob["sha"]})
    if i % 10 == 0 or i == len(files):
        print(f"  已上传 {i}/{len(files)}")

print("创建 tree…")
tree = api("POST", f"/repos/{owner}/{repo}/git/trees",
           ({"base_tree": base_tree, "tree": tree_entries} if base_tree else {"tree": tree_entries}))
print("创建 commit…")
msg = """多缸发动机图谱：27 台机型 + 可交互 3D 解剖台

- 27 台 5–16 缸高性能机型参数图谱（W16/W12/X16/V16/V12/V10/V8/V6/VR6/直5·6）
- 3D 解剖台：程序化几何，支持旋转、剖切、拆解、转速与点火时序
- 全部示意图与 3D 模型为原创，无第三方图片/文案；Three.js 遵循 MIT
- 代码 MIT，内容 CC BY-NC 4.0"""
commit = api("POST", f"/repos/{owner}/{repo}/git/commits",
             {"message": msg, "tree": tree["sha"], "parents": [base_sha]})
print("更新分支…")
res = api("PATCH", f"/repos/{owner}/{repo}/git/refs/heads/{branch}", {"sha": commit["sha"]})
print("结果:", "成功" if not res.get("error") else res)
print(f"https://github.com/{owner}/{repo}")
PY
