#!/usr/bin/env node

const { Command } = require('commander');
const { convertMarkdownImages } = require('./index');
const fs = require('fs');
const path = require('path');

const program = new Command();

program
  .name('md-img-base64')
  .description('将 markdown 文件中的本地图片转换为 base64 编码嵌入，智能跳过代码块')
  .version('1.2.0')
  .argument('<input>', '输入的 markdown 文件路径')
  .option('-o, --output <path>', '输出文件路径（默认覆盖原文件）')
  .option('--no-backup', '不创建备份文件')
  .action((input, options) => {
    try {
      const inputPath = path.resolve(input);
      
      if (!fs.existsSync(inputPath)) {
        console.error(`错误: 文件不存在: ${inputPath}`);
        process.exit(1);
      }
      
      // 创建备份
      if (options.backup !== false) {
        const backupPath = inputPath + '.bak';
        fs.copyFileSync(inputPath, backupPath);
        console.log(`✓ 已创建备份: ${backupPath}`);
      }
      
      // 处理文件
      const outputPath = options.output ? path.resolve(options.output) : inputPath;
      convertMarkdownImages(inputPath, outputPath);
      
    } catch (error) {
      console.error(`错误: ${error.message}`);
      process.exit(1);
    }
  });

program.parse();
