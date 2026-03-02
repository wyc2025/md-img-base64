// 测试文件
const { convertMarkdownImages, convertMarkdownString, imageToBase64 } = require('./index');
const path = require('path');

console.log('=== 测试 md-img-base64 ===\n');

// 测试 1: 转换单个 markdown 文件
console.log('测试 1: 转换 markdown 文件');
const testFile = path.join(__dirname, '../zst讲义—作者：理想/软件设计师讲义.md');
const outputFile = path.join(__dirname, '../zst讲义—作者：理想/软件设计师讲义-converted.md');

try {
  convertMarkdownImages(testFile, outputFile);
  console.log('✓ 测试 1 通过\n');
} catch (error) {
  console.error('✗ 测试 1 失败:', error.message, '\n');
}

// 测试 2: 转换单个图片
console.log('测试 2: 转换单个图片为 base64');
const testImage = path.join(__dirname, '../zst讲义—作者：理想/assets/1.png');

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

console.log('=== 测试完成 ===');
