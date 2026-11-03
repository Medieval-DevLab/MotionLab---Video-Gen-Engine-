// Headless Chrome for every render script, set up so a render can never hang.
// - Every DevTools call times out after 60 s, so a stuck frame fails loudly instead of waiting forever.
// - close() asks Chrome for all its process ids (browser, renderer, GPU, utility) and kills each one directly. It has
//   nothing to save once the frames are taken. Puppeteer's own close runs `taskkill /T`, which hangs whenever Windows
//   process listing (WMI) stalls, as it does on this machine.
// - If anything still holds the process open 5 s after close, it exits anyway.
import puppeteer from 'puppeteer-core';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const ARGS = ['--force-device-scale-factor=1', '--allow-file-access-from-files', '--disable-gpu', '--hide-scrollbars'];
const within = (p, ms) => { let t; return Promise.race([p, new Promise((r) => { t = setTimeout(r, ms, null); })]).finally(() => clearTimeout(t)); };

export const launch = () => puppeteer.launch({ executablePath: CHROME, headless: true, args: ARGS, protocolTimeout: 60000 });

export async function close(browser) {
  const main = browser.process()?.pid;
  const info = await within(browser.target().createCDPSession().then((s) => s.send('SystemInfo.getProcessInfo')).catch(() => null), 5000);
  const pids = [...(info?.processInfo || []).map((p) => p.id).filter((id) => id && id !== main), main].filter(Boolean);
  for (const pid of pids) { try { process.kill(pid, 'SIGKILL'); } catch {} } // children first, then the browser
  await browser.disconnect().catch(() => {});
  setTimeout(() => { console.log('  a handle was still open 5 s after close: exiting'); process.exit(process.exitCode ?? 0); }, 5000).unref();
}
