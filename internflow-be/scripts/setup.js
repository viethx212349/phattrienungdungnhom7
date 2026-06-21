/**
 * InternFlow Backend - Interactive Setup Script
 * Chạy: npm run setup
 * 
 * Script này sẽ tự động copy .env.example thành .env và generate Prisma Client
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ENV_PATH = path.join(__dirname, '..', '.env');
const ENV_EXAMPLE_PATH = path.join(__dirname, '..', '.env.example');

function main() {
  console.log('');
  console.log('============================================');
  console.log('  InternFlow Backend - Setup Environment');
  console.log('============================================');
  console.log('');

  // Check if .env exists
  if (fs.existsSync(ENV_PATH)) {
    console.log('[!] File .env đã tồn tại. Bỏ qua bước tạo file.');
  } else {
    // Copy .env.example to .env
    console.log('[*] Đang tạo file .env từ .env.example...');
    if (fs.existsSync(ENV_EXAMPLE_PATH)) {
      fs.copyFileSync(ENV_EXAMPLE_PATH, ENV_PATH);
      console.log('[✓] File .env đã được tạo thành công!');
    } else {
      console.log('[✗] Không tìm thấy file .env.example!');
      process.exit(1);
    }
  }
  console.log('');

  // Generate Prisma client
  console.log('[*] Đang generate Prisma Client...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log('[✓] Prisma Client đã generate thành công!');
  } catch (err) {
    console.log('[!] Lỗi khi generate Prisma Client. Hãy chạy lại: npx prisma generate');
  }

  console.log('');
  console.log('============================================');
  console.log('  ✅ Setup hoàn tất! Chạy "npm run dev"');
  console.log('============================================');
  console.log('');
}

main();
