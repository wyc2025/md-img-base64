// 测试文件
const { convertMarkdownImages, convertMarkdownString, imageToBase64 } = require('./index');
const fs = require('fs');
const path = require('path');

console.log('=== 测试 md-img-base64 ===\n');

// 创建测试用的 markdown 文件和图片
const testDir = path.join(__dirname, '../test-temp');
const testFile = path.join(testDir, 'test.md');
const testImage = path.join(testDir, 'test-image.png');

// 清理旧的测试目录
if (fs.existsSync(testDir)) {
  fs.rmSync(testDir, { recursive: true, force: true });
}

// 创建测试目录
fs.mkdirSync(testDir, { recursive: true });

// 创建一个简单的 PNG 图片（1x1 像素透明图片）
const pngData = Buffer.from([
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
  0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1
  0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
  0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41, // IDAT
  0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
  0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4,
  0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, // IEND
  0xAE, 0x42, 0x60, 0x82
]);
fs.writeFileSync(testImage, pngData);

// 创建测试 markdown 文件
const testMarkdownContent = `# 测试文档

这是一张本地图片（Markdown 语法）：

![测试图片](./test-image.png)

## HTML img 标签测试

### 双引号 src
<img src="./test-image.png" alt="测试图片" width="200">

### 单引号 src
<img src='./test-image.png' alt='测试图片'>

### 无引号 src
<img src=./test-image.png width=200>

### 带多个属性
<img width="200" height="100" src="./test-image.png" alt="测试图片" class="image">

## 网络图片和已嵌入图片

![网络图片](https://example.com/image.png)

<img src="https://example.com/image2.png" alt="网络图片">

![已嵌入图片](data:image/png;base64,iVBORw0KGgo=)

<img src="data:image/jpeg;base64,/9j/4AAQ" alt="已嵌入">

## 代码块保护测试

### JavaScript 代码块
\`\`\`javascript
// 这里的图片引用不应该被转换
![代码中的图片](./test-image.png)
<img src="./test-image.png" alt="代码中的图片">
\`\`\`

### Bash 代码块
\`\`\`bash
# 这个也不应该被转换
![bash图片](./test-image.png)
\`\`\`

### 行内代码测试
这是一段包含 \`![行内代码中的图片](./test-image.png)\` 的文本。
`;
fs.writeFileSync(testFile, testMarkdownContent, 'utf-8');

// 测试 1: 转换单个 markdown 文件
console.log('测试 1: 转换 markdown 文件');
const outputFile = path.join(testDir, 'test-output.md');

try {
  convertMarkdownImages(testFile, outputFile);

  // 验证输出文件
  const outputContent = fs.readFileSync(outputFile, 'utf-8');
  
  // 检查代码块中的内容是否保持原样
  const codeBlockContent = outputContent.match(/```javascript[\s\S]*?```/)[0];
  const codeBlockHasOriginalPath = codeBlockContent.includes('./test-image.png');
  const codeBlockHasNoBase64 = !codeBlockContent.includes('data:image/png;base64');
  
  // 检查行内代码中的内容是否保持原样
  const inlineCodeHasOriginalPath = outputContent.includes('`![行内代码中的图片](./test-image.png)`');
  
  // 检查正常的图片是否被转换
  const hasBase64 = outputContent.includes('data:image/png;base64');
  const hasNetworkImage = outputContent.includes('https://example.com/image.png');
  const hasHtmlImgBase64 = /<img[^>]+src="data:image\/png;base64/i.test(outputContent);

  // 验证代码块保护
  if (codeBlockHasOriginalPath && codeBlockHasNoBase64 && inlineCodeHasOriginalPath) {
    console.log('✓ 测试 1 通过: 代码块保护正常工作\n');
  } else {
    console.log('✗ 测试 1 失败: 代码块保护异常');
    console.log(`  - codeBlockHasOriginalPath: ${codeBlockHasOriginalPath}`);
    console.log(`  - codeBlockHasNoBase64: ${codeBlockHasNoBase64}`);
    console.log(`  - inlineCodeHasOriginalPath: ${inlineCodeHasOriginalPath}\n`);
  }
  
  // 验证正常图片转换
  if (hasBase64 && hasNetworkImage && hasHtmlImgBase64) {
    console.log('✓ 测试 2 通过: Markdown 图片和 HTML img 标签都已转换\n');
  } else {
    console.log('✗ 测试 2 失败: 转换结果不符合预期');
    console.log(`  - hasBase64: ${hasBase64}`);
    console.log(`  - hasNetworkImage: ${hasNetworkImage}`);
    console.log(`  - hasHtmlImgBase64: ${hasHtmlImgBase64}\n`);
  }
} catch (error) {
  console.error('✗ 测试失败:', error.message, '\n');
}

// 测试 2: 转换单个图片为 base64
console.log('测试 2: 转换单个图片为 base64');

try {
  const base64 = imageToBase64(testImage);
  if (base64 && base64.startsWith('data:image/png;base64,')) {
    console.log('✓ 测试 2 通过');
    console.log(`  Base64 长度: ${base64.length} 字符\n`);
  } else {
    console.log('✗ 测试 2 失败: base64 格式不正确\n');
  }
} catch (error) {
  console.error('✗ 测试 2 失败:', error.message, '\n');
}

// 测试 3: 转换 markdown 字符串
console.log('测试 3: 转换 markdown 字符串');

try {
  const markdownStr = `![图片](./test-image.png) <img src="./test-image.png" alt="测试">
  
\`\`\`javascript
// 代码块中的不应该转换
![代码图片](./test-image.png)
\`\`\`

这是一段 \`![行内代码图片](./test-image.png)\` 的文本。`;
  const converted = convertMarkdownString(markdownStr, testDir);

  const hasMarkdownBase64 = converted.includes('![图片](data:image/png;base64,');
  const hasHtmlBase64 = converted.includes('<img src="data:image/png;base64,');
  const hasCodeBlockOriginalPath = converted.includes('![代码图片](./test-image.png)');
  const hasInlineCodeOriginalPath = converted.includes('`![行内代码图片](./test-image.png)`');

  if (hasMarkdownBase64 && hasHtmlBase64 && hasCodeBlockOriginalPath && hasInlineCodeOriginalPath) {
    console.log('✓ 测试 3 通过: markdown 字符串转换成功，代码块保护正常\n');
  } else {
    console.log('✗ 测试 3 失败: markdown 字符串转换失败');
    console.log(`  - hasMarkdownBase64: ${hasMarkdownBase64}`);
    console.log(`  - hasHtmlBase64: ${hasHtmlBase64}`);
    console.log(`  - hasCodeBlockOriginalPath: ${hasCodeBlockOriginalPath}`);
    console.log(`  - hasInlineCodeOriginalPath: ${hasInlineCodeOriginalPath}\n`);
  }
} catch (error) {
  console.error('✗ 测试 3 失败:', error.message, '\n');
}

// 清理测试文件
console.log('清理测试文件...');
fs.rmSync(testDir, { recursive: true, force: true });
console.log('✓ 测试完成\n');

console.log('=== 所有测试完成 ===');
