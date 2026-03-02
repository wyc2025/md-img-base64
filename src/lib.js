const fs = require('fs');
const path = require('path');

/**
 * 将文件转换为 base64 编码
 * @param {string} filePath - 图片文件路径
 * @returns {string} base64 编码的字符串
 */
function fileToBase64(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp',
      '.bmp': 'image/bmp'
    };
    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
  } catch (error) {
    console.warn(`警告: 无法读取图片文件 ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * 处理 markdown 文本，将图片引用转换为 base64
 * @param {string} content - markdown 内容
 * @param {string} markdownDir - markdown 文件所在目录
 * @returns {string} 处理后的 markdown 内容
 */
function processMarkdown(content, markdownDir) {
  // 匹配 markdown 图片语法: ![alt](path)
  const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  
  return content.replace(imgRegex, (match, alt, imagePath) => {
    // 如果已经是 data URI 或 URL，则跳过
    if (imagePath.startsWith('data:') || imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return match;
    }
    
    // 解析相对路径
    let absolutePath;
    if (path.isAbsolute(imagePath)) {
      absolutePath = imagePath;
    } else {
      // 处理 ./assets/xxx.png 或 assets/xxx.png 的情况
      absolutePath = path.resolve(markdownDir, imagePath);
    }
    
    // 检查文件是否存在
    if (!fs.existsSync(absolutePath)) {
      console.warn(`警告: 图片文件不存在: ${absolutePath}`);
      return match;
    }
    
    // 转换为 base64
    const base64 = fileToBase64(absolutePath);
    if (base64) {
      console.log(`✓ 已转换: ${imagePath}`);
      return `![${alt}](${base64})`;
    }
    
    return match;
  });
}

/**
 * 处理 markdown 文件
 * @param {string} markdownFilePath - markdown 文件路径
 * @param {string} outputPath - 输出文件路径（可选）
 * @returns {string} 处理后的内容
 */
function processMarkdownFile(markdownFilePath, outputPath = null) {
  if (!fs.existsSync(markdownFilePath)) {
    throw new Error(`文件不存在: ${markdownFilePath}`);
  }
  
  console.log(`正在处理: ${markdownFilePath}`);
  
  // 读取 markdown 文件
  const content = fs.readFileSync(markdownFilePath, 'utf-8');
  const markdownDir = path.dirname(markdownFilePath);
  
  // 处理图片
  const processedContent = processMarkdown(content, markdownDir);
  
  // 确定输出路径
  const finalOutputPath = outputPath || markdownFilePath;
  
  // 写入文件
  fs.writeFileSync(finalOutputPath, processedContent, 'utf-8');
  console.log(`✓ 处理完成，已保存到: ${finalOutputPath}`);
  
  return processedContent;
}

module.exports = {
  fileToBase64,
  processMarkdown,
  processMarkdownFile
};
