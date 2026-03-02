# md-img-base64

将 markdown 文件中的本地图片转换为 base64 编码嵌入，实现单文件分发。

## 功能特性

- ✅ 自动将 markdown 文件中的本地图片转换为 base64 编码
- ✅ 支持 Markdown 语法：`![alt](path)`
- ✅ 支持 HTML img 标签：`<img src="path">`
- ✅ 支持多种引号格式：双引号、单引号、无引号
- ✅ 支持多种图片格式（PNG, JPG, GIF, SVG, WebP, BMP）
- ✅ 自动识别相对路径和绝对路径
- ✅ **智能跳过代码块**：不会转换代码块中的图片引用
- ✅ **智能跳过行内代码**：不会转换行内代码中的图片引用
- ✅ 命令行工具，支持直接运行
- ✅ 可选自动备份原文件
- ✅ 可作为 Node.js 模块集成到项目中

## 安装

### 临时使用

```bash
npx md-img-base64 your-file.md
```
ps: 如果需要还原，从md中提取图片，可以使用 @wll8/md-img 包。https://www.npmjs.com/package/@wll8/md-img

### 全局安装（推荐用于命令行使用）

```bash
npm install -g md-img-base64
```

### 局部安装（用于项目中使用）

```bash
npm install md-img-base64
```

## 使用方法

### 命令行使用

安装后，可以直接使用 `md-img-base64` 命令：

```bash
# 转换文件（默认创建 .bak 备份）
md-img-base64 your-file.md

# 指定输出文件
md-img-base64 your-file.md -o output.md

# 不创建备份
md-img-base64 your-file.md --no-backup

# 查看帮助
md-img-base64 --help
```

### 作为 Node.js 模块使用

```javascript
const { convertMarkdownImages } = require('md-img-base64');

// 转换 markdown 文件（会覆盖原文件）
convertMarkdownImages('path/to/your/file.md');

// 或指定输出文件
convertMarkdownImages('input.md', 'output.md');

// 转换 markdown 字符串
const { convertMarkdownString } = require('md-img-base64');
const content = '![图片](./images/pic.png)';
const converted = convertMarkdownString(content, '/path/to/base/dir');

// 单独转换图片为 base64
const { imageToBase64 } = require('md-img-base64');
const base64 = imageToBase64('./images/pic.png');
console.log(base64);
```

### 示例

假设你有以下 markdown 文件：

```markdown
# 我的文档

## Markdown 语法

![本地图片](./assets/image.png)

![绝对路径图片](/Users/xxx/project/images/pic.jpg)

## HTML img 标签

<img src="./assets/image.png" alt="本地图片">

<img src='./assets/image.png' alt='单引号'>

<img src=./assets/image.png width=200>

## 代码块保护

\`\`\`javascript
// 代码块中的图片不会被转换
![代码中的图片](./assets/image.png)
\`\`\`

这是一段包含 \`![行内代码中的图片](./assets/image.png)\` 的文本。
```

运行命令：

```bash
md-img-base64 doc.md
```

转换后的文件：

```markdown
# 我的文档

## Markdown 语法

![本地图片](data:image/png;base64,iVBORw0KGgoAAAANS...)

![绝对路径图片](data:image/jpeg;base64,/9j/4AAQSkZJRg...)

## HTML img 标签

<img src="data:image/png;base64,iVBORw0KGgoAAAANS..." alt="本地图片">

<img src='data:image/png;base64,iVBORw0KGgoAAAANS...' alt='单引号'>

<img src=data:image/png;base64,iVBORw0KGgoAAAANS... width=200>

## 代码块保护

\`\`\`javascript
// 代码块中的图片不会被转换
![代码中的图片](./assets/image.png)  ⛔ 保持原样
\`\`\`

这是一段包含 \`![行内代码中的图片](./assets/image.png)\` 的文本。  ⛔ 保持原样
```

> **注意**: 代码块和行内代码中的图片引用会被智能跳过，不会被转换！

## API 文档

### `convertMarkdownImages(filePath, outputPath)`

将 markdown 文件中的图片转换为 base64。

- **参数**:
  - `filePath` (string): 输入的 markdown 文件路径
  - `outputPath` (string, 可选): 输出文件路径，默认覆盖原文件
- **返回值**: 处理后的 markdown 内容字符串

### `convertMarkdownString(markdownContent, baseDir)`

将 markdown 字符串中的图片转换为 base64。

- **参数**:
  - `markdownContent` (string): markdown 内容字符串
  - `baseDir` (string): 基准目录（用于解析相对路径）
- **返回值**: 处理后的 markdown 内容字符串

### `imageToBase64(imagePath)`

将图片文件转换为 base64 编码。

- **参数**:
  - `imagePath` (string): 图片文件路径
- **返回值**: base64 编码的 data URI 字符串

## 注意事项

- ⚠️ 图片转换为 base64 后文件体积会增大约 33%，不建议处理大量大图片
- ⚠️ 转换后的文件可能变得很大，某些 markdown 编辑器可能性能不佳
- 💡 建议在发布文档前进行转换，以方便单文件分发
- 💡 默认会创建 `.bak` 备份文件，可用 `--no-backup` 选项禁用

## 支持的图片格式

- PNG (`.png`)
- JPEG (`.jpg`, `.jpeg`)
- GIF (`.gif`)
- SVG (`.svg`)
- WebP (`.webp`)
- BMP (`.bmp`)

## 开发

```bash
# 克隆仓库
git clone https://github.com/yourusername/md-img-base64.git

# 安装依赖
npm install

# 运行测试
npm test

# 本地测试命令行工具
node src/cli.js your-file.md
```

## License

MIT

## 作者

Your Name

## 贡献

欢迎提交 Issue 和 Pull Request！
