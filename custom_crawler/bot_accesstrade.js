const puppeteer = require('puppeteer');
const axios = require('axios');

(async () => {
  console.log('🤖 Bot đang khởi động...');

  // 1. Mở trình duyệt giả lập (Headless Mode)
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // 2. Gắn Cookie bạn vừa copy ở Bước 1 vào Bot thông qua Header
  await page.setExtraHTTPHeaders({
    'Cookie': 'watch_guidance=false'
  });

  // 3. Xâm nhập vào sào huyệt
  console.log('🌍 Đang truy cập Lịch Sự Kiện AccessTrade...');
  await page.goto('https://pub2.accesstrade.vn/tool/hot_deal', {
    waitUntil: 'networkidle2'
  });

  // Kiểm tra xem có bị văng ra trang Login không
  console.log('➡️ URL hiện tại:', page.url());

  // In ra một ít HTML để xem
  const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 200));
  console.log('📄 Nội dung tìm thấy:', bodyText.replace(/\n+/g, ' '));

  // 4. Bóc tách dữ liệu DOM (HTML)
  console.log('🔍 Đang bóc tách dữ liệu...');
  const events = await page.evaluate(() => {
    const results = [];
    // Phân tích cấu trúc HTML của AccessTrade (Dùng F12 Inspect từng cục lịch)
    // Script này giả định các cục event nằm trong class .hot-deal-item
    const items = document.querySelectorAll('.calendar-event-box, .fc-event');

    items.forEach(item => {
      results.push({
        title: item.querySelector('.event-title')?.innerText?.trim(),
        date: item.closest('.fc-day')?.getAttribute('data-date'),
        link: item.querySelector('a')?.href
      });
    });
    return results;
  });

  console.log(`✅ Thu thập được ${events.length} sự kiện Lịch!`);
  console.log(events);

  // 5. [TÙY CHỌN] Bắn thẳng đống Data này về Backend Rails của bạn
  /*
  await axios.post('http://localhost:3000/api/v1/import_at_events', {
    events: events
  });
  */

  await browser.close();
  console.log('💤 Bot đi ngủ.');
})();
