const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

// 定义输入和输出路径
const docxPath = path.join(__dirname, 'protocol.docx');
const htmlPath = path.join(__dirname, 'protocol.html');

// 检查文件是否存在
if (!fs.existsSync(docxPath)) {
    console.error(`\n❌ 错误：找不到文件 ${docxPath}`);
    console.log('💡 请将你需要转换的 Word 文档重命名为 "protocol.docx" 并放在项目根目录下！\n');
    process.exit(1);
}

console.log('🔄 正在转换文档，请稍候...');

// 使用 mammoth 转换文档
mammoth.convertToHtml({ path: docxPath })
    .then((result) => {
        const html = result.value; // 生成的纯净 HTML
        
        // 写入到 protocol.html
        fs.writeFileSync(htmlPath, html, 'utf8');
        console.log(`\n✅ HTML 转换成功！`);
        console.log(`📄 纯净无乱码的 HTML 已生成在：${htmlPath}`);
        console.log(`\n======================================================`);
        console.log(`[ 这里是生成的 HTML 代码，你可以直接复制到 Vue 中 ]\n`);
        console.log(html);
        console.log(`\n======================================================\n`);
        
        // 如果有任何警告信息，打印出来
        if (result.messages && result.messages.length > 0) {
            console.warn('⚠️ 转换警告（这些通常可以忽略）：');
            result.messages.forEach(msg => console.warn(' -', msg.message));
        }
    })
    .catch((err) => {
        console.error('\n❌ 转换过程中发生错误：', err);
    });
