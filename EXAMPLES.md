# 使用示例

## 示例 1: 命令行使用

```bash
# 基本用法
md-img-base64 README.md

# 指定输出文件
md-img-base64 README.md -o README-with-images.md

# 不创建备份
md-img-base64 README.md --no-backup
```

## 示例 2: 作为 Node.js 模块使用

### 转换文件

```javascript
const { convertMarkdownImages } = require('md-img-base64');

// 转换文件（覆盖原文件）
convertMarkdownImages('README.md');

// 转换并保存到新文件
convertMarkdownImages('README.md', 'README-converted.md');
```

### 转换字符串

```javascript
const { convertMarkdownString } = require('md-img-base64');

const markdown = `
# 我的文档

![本地图片](./images/logo.png)
`;

const converted = convertMarkdownString(markdown, '/path/to/project');
console.log(converted);
```

### 转换单张图片

```javascript
const { imageToBase64 } = require('md-img-base64');

const base64 = imageToBase64('./images/logo.png');
console.log(base64);
// 输出: data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...
```

## 示例 3: 在 Web 项目中使用

```javascript
const fs = require('fs');
const { convertMarkdownImages } = require('md-img-base64');

// 读取并转换 markdown
const content = fs.readFileSync('docs/README.md', 'utf-8');
const converted = convertMarkdownImages('docs/README.md');

// 在网页中使用转换后的内容
const html = marked(converted); // 使用 marked 等 markdown 解析器
```

## 示例 4: 批量处理多个文件

```javascript
const fs = require('fs');
const path = require('path');
const { convertMarkdownImages } = require('md-img-base64');

// 遍历目录中的所有 .md 文件
function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (path.extname(file) === '.md') {
      console.log(`处理: ${filePath}`);
      try {
        convertMarkdownImages(filePath);
      } catch (error) {
        console.error(`错误: ${error.message}`);
      }
    }
  });
}

// 处理当前目录
processDirectory('.');
```

## 示例 5: 与构建工具集成

### 在 package.json 中添加脚本

```json
{
  "scripts": {
    "prepare-docs": "node scripts/prepare-docs.js"
  }
}
```

### 创建准备脚本 (scripts/prepare-docs.js)

```javascript
const { convertMarkdownImages } = require('md-img-base64');
const glob = require('glob');

// 批量转换所有 markdown 文件
glob('docs/**/*.md', (err, files) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  files.forEach(file => {
    console.log(`转换: ${file}`);
    convertMarkdownImages(file);
  });

  console.log('✓ 所有文档转换完成');
});
```

## 示例 6: 在 CI/CD 中使用

### GitHub Actions 示例

```yaml
name: Build Docs

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Prepare docs
        run: npm run prepare-docs

      - name: Upload docs
        uses: actions/upload-artifact@v2
        with:
          name: docs
          path: docs/
```

## 注意事项

1. **文件大小**: base64 编码会使文件体积增加约 33%
2. **大图片**: 不建议处理大量大图片（> 1MB）
3. **性能**: 转换后的 markdown 文件可能变得很大，某些编辑器可能性能不佳
4. **备份**: 默认会创建 `.bak` 备份文件，确保数据安全
5. **网络图片**: 以 `http://` 或 `https://` 开头的图片不会被转换
6. **已嵌入图片**: 已经是 `data:` URI 的图片不会被重复转换
