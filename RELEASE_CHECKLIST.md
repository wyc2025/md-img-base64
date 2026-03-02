# 发布前检查清单

## ✅ 代码检查

- [x] 所有代码文件已检查，无第三方版权内容
- [x] 测试文件已更新，使用自包含的测试数据
- [x] 所有功能测试通过（3/3）
- [x] 代码无语法错误
- [x] CLI 工具可正常运行

## ✅ 文档检查

- [x] README.md 完整清晰
- [x] LICENSE 文件存在（MIT）
- [x] EXAMPLES.md 提供详细示例
- [x] package.json 元数据完整

## ✅ 配置检查

### package.json 检查

```json
{
  "name": "md-img-base64",           // ✅ 包名
  "version": "1.0.0",                // ✅ 版本号
  "description": "...",               // ✅ 描述
  "main": "src/index.js",             // ✅ 入口文件
  "bin": {                            // ✅ 命令行工具
    "md-img-base64": "./src/cli.js"
  },
  "keywords": [...],                   // ✅ 关键词
  "license": "MIT",                    // ✅ 许可证
  "engines": {                        // ✅ Node 版本要求
    "node": ">=14.0.0"
  }
}
```

## ✅ 发布步骤

### 1. 检查包名是否可用

```bash
npm view md-img-base64
```

如果返回 `404 Not Found`，则包名可用。

### 2. 登录 npm

```bash
npm login
```

### 3. 测试本地包

```bash
npm test

# 测试 CLI
node src/cli.js your-test-file.md
```

### 4. 推送到 GitHub（可选但推荐）

```bash
git init
git add .
git commit -m "Initial release: md-img-base64 v1.0.0"
git remote add origin https://github.com/yourusername/md-img-base64.git
git push -u origin main
```

### 5. 发布到 npm

```bash
npm publish
```

### 6. 验证发布

```bash
# 查看包信息
npm view md-img-base64

# 全局安装测试
npm install -g md-img-base64
md-img-base64 --help
```

## 📦 发布后的后续工作

- [ ] 在 GitHub README 中添加 npm 徽章
- [ ] 标记 GitHub Release
- [ ] 分享到社交媒体
- [ ] 收集用户反馈

## 🔧 故障排除

### 包名已被占用

修改 `package.json` 中的 `name` 字段，使用其他名称：
- `@username/md-img-base64` (作用域包)
- `md-img-to-base64`
- `markdown-image-embed`
- `md-base64-embed`

### 登录失败

确保使用正确的 npm 用户名和密码，或尝试：

```bash
npm logout
npm login
```

### 发布失败 - 403 Forbidden

检查：
1. 是否有发布权限
2. 包名是否已被占用
3. `.npmrc` 配置是否正确

### 2FA 问题

如果启用了两步验证，需要使用 OTP 令牌：

```bash
npm publish --otp=123456
```

## 📝 更新版本号

发布更新时，遵循语义化版本：

```bash
# 补丁版本（bug 修复）
npm version patch  # 1.0.0 -> 1.0.1

# 次版本（新功能，向后兼容）
npm version minor  # 1.0.0 -> 1.1.0

# 主版本（破坏性变更）
npm version major  # 1.0.0 -> 2.0.0

# 发布新版本
npm publish
```

## 🎉 完成！

现在你的 npm 包已经准备好发布了！
