const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.resolve(__dirname, '../docs/screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function loginAndGetToken(email, password) {
  const res = await fetch('http://localhost:5000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(`Login failed for ${email}: ${data.message}`);
  }
  return data.data.token;
}

async function main() {
  console.log('Obtaining authentication tokens for capture sessions...');
  const adminToken = await loginAndGetToken('admin@campusgrid.com', 'AdminPassword2026!');
  const deanToken = await loginAndGetToken('dean@campusgrid.com', 'Password123');
  const facultyToken = await loginAndGetToken('subu@campusgrid.com', 'password@123');

  console.log('Launching Chrome browser...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();

  // Helper to ensure focus is removed from buttons/inputs before screenshot
  async function cleanFocusAndSettle() {
    await page.evaluate(() => {
      if (document.activeElement && document.activeElement !== document.body) {
        document.activeElement.blur();
      }
    });
    await page.mouse.move(0, 0);
    await page.waitForTimeout(1000);
  }

  // 1. Standard Login Page
  console.log('Capturing: Standard Login Page (campusgrid-login.png)...');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
  await cleanFocusAndSettle();
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'campusgrid-login.png') });

  // 2. Dean Login Page
  console.log('Capturing: Dean Login Page (campusgrid-dean-login.png)...');
  await page.goto('http://localhost:5173/dean/login', { waitUntil: 'networkidle' });
  await cleanFocusAndSettle();
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'campusgrid-dean-login.png') });

  // Helper for authenticated navigation
  async function captureWithToken(token, url, filename, waitSelector) {
    console.log(`Capturing: ${filename} (${url})...`);
    await page.goto('http://localhost:5173/login');
    await page.evaluate((t) => {
      localStorage.setItem('campus_grid_token', t);
    }, token);
    await page.goto(`http://localhost:5173${url}`, { waitUntil: 'networkidle' });
    if (waitSelector) {
      try {
        await page.waitForSelector(waitSelector, { timeout: 6000 });
      } catch (e) {
        console.warn(`Selector ${waitSelector} timed out on ${url}, continuing...`);
      }
    }
    await cleanFocusAndSettle();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, filename) });
  }

  // 3. Admin Dashboard
  await captureWithToken(adminToken, '/admin/dashboard', 'campusgrid-admin-dashboard.png', '.dashboard-stats, .stat-card, .metric-card');

  // 4. Admin Timetable Management
  await captureWithToken(adminToken, '/admin/timetable', 'campusgrid-timetable-management.png', '.timetable-grid, table, .admin-card');

  // 5. Admin Faculty Management
  await captureWithToken(adminToken, '/admin/faculty', 'campusgrid-admin-faculty.png', '.faculty-table, .faculty-card, table');

  // 6. Dean Dashboard
  await captureWithToken(deanToken, '/dean/dashboard', 'campusgrid-dean-dashboard.png', '.dp-summary-grid, .dp-card');

  // 7. Dean Current Status
  await captureWithToken(deanToken, '/dean/current-status', 'campusgrid-dean-live-status.png', '.dp-search-panel, .dp-card');

  // 8. Dean Free Rooms Discovery
  await captureWithToken(deanToken, '/dean/free-rooms', 'campusgrid-dean-free-rooms.png', '.dp-search-panel, .dp-card');

  // 9. Dean Substitutions Oversight
  await captureWithToken(deanToken, '/dean/substitutions', 'campusgrid-dean-substitutions.png', '.dp-card, table');

  // 10. Faculty Dashboard
  await captureWithToken(facultyToken, '/faculty/dashboard', 'campusgrid-faculty-dashboard.png', '.faculty-card, .dashboard-stats, .card');

  // 11. Faculty Weekly Schedule Matrix
  await captureWithToken(facultyToken, '/faculty/weekly', 'campusgrid-faculty-weekly-timetable.png', '.timetable-grid, table, .weekly-card');

  // 12. Faculty Substitutions Management
  await captureWithToken(facultyToken, '/faculty/substitutions', 'campusgrid-faculty-substitutions.png', '.substitution-card, .card');

  console.log('All real CampusGrid screenshots captured cleanly!');
  await browser.close();
}

main().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
