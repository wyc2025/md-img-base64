const { processMarkdownFile, processMarkdown, fileToBase64 } = require('./lib');

/**
 * 将 markdown 文件中的本地图片转换为 base64 编码
 * @param {string} markdownFilePath - markdown 文件路径
 * @param {string} outputPath - 输出文件路径（可选，默认覆盖原文件）
 * @returns {string} 处理后的内容
 */
function convertMarkdownImages(markdownFilePath, outputPath = null) {
  return processMarkdownFile(markdownFilePath, outputPath);
}

/**
 * 将 markdown 字符串中的本地图片转换为 base64 编码
 * @param {string} markdownContent - markdown 内容字符串
 * @param {string} baseDir - 基准目录（用于解析相对路径）
 * @returns {string} 处理后的 markdown 内容
 */
function convertMarkdownString(markdownContent, baseDir) {
  return processMarkdown(markdownContent, baseDir);
}

/**
 * 将图片文件转换为 base64 编码
 * @param {string} imagePath - 图片文件路径
 * @returns {string} base64 编码的 data URI
 */
function imageToBase64(imagePath) {
  return fileToBase64(imagePath);
}

module.exports = {
  convertMarkdownImages,
  convertMarkdownString,
  imageToBase64
};
