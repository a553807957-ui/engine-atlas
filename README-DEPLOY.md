# 部署说明

本站已通过 GitHub Pages 发布：https://a553807957-ui.github.io/engine-atlas/

当前 Pages 使用 **Deploy from a branch**（main / 根目录）。这套方案不需要任何 CI，推送即发布。

## 可选：改用 GitHub Actions 部署

仓库里留了 `.github/workflows/deploy.yml.example`。如果你想让 Actions 接管部署（例如以后加构建步骤），需要：

1. 把 `.github/workflows/deploy.yml.example` 复制为 `.github/workflows/deploy.yml`
2. 推到仓库（需要用带 `workflow` 权限的 token 推送，或直接在 GitHub 网页上新建该文件并粘贴内容）
3. 仓库 Settings → Pages → Source 改为 **GitHub Actions**

## 本地构建

```bash
sh build.sh        # 重新打包 vendor/engine3d.bundle.js
python3 gen_layouts.py   # 重新生成 assets/layouts/*.svg
```
