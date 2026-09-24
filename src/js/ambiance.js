// Live Restaurant Status Manager for MELT Burgers (Dehiwala & Colombo 03)
// Operating Hours:
// - Monday – Sunday (Daily): 1:30 PM – 11:00 PM
// - Dine In + Takeaway | 100% Halal

export function initAmbiance() {
  updateCafeStatus();
  // Check every 30 seconds for live accuracy
  setInterval(updateCafeStatus, 30000);
}

// Get Sri Lanka local time (Asia/Colombo)
function getSriLankaTime() {
  const now = new Date();
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Colombo',
      hour12: false,
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
    });
    const parts = formatter.formatToParts(now);
    let weekday = 'Thu';
    let hour = now.getHours();
    let minute = now.getMinutes();

    for (const p of parts) {
      if (p.type === 'weekday') weekday = p.value;
      if (p.type === 'hour') hour = parseInt(p.value, 10);
      if (p.type === 'minute') minute = parseInt(p.value, 10);
    }
    if (hour === 24) hour = 0;
    return { weekday, hour, minute, decimalTime: hour + minute / 60 };
  } catch (e) {
    // Fallback to local time if Intl timeZone fails
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return {
      weekday: days[now.getDay()],
      hour: now.getHours(),
      minute: now.getMinutes(),
      decimalTime: now.getHours() + now.getMinutes() / 60,
    };
  }
}

// Live MELT Restaurant Open/Closed Status
export function updateCafeStatus() {
  const statusBadge = document.getElementById('hero-status-badge');
  const pulseDot = document.getElementById('status-pulse-dot');
  const statusLabel = document.getElementById('cafe-status-label');
  const statusSub = document.getElementById('cafe-status-sub');

  if (!statusLabel) return;

  const { decimalTime } = getSriLankaTime();

  const openTime = 13.5;  // 1:30 PM
  const closeTime = 23.0; // 11:00 PM

  let isOpen = false;
  let label = 'Closed';
  let sub = '';

  if (decimalTime >= openTime && decimalTime < closeTime) {
    // Currently Open
    isOpen = true;
    label = 'Open Today';
    sub = 'Closes 11:00 PM · Dine In / Takeaway';
  } else if (decimalTime < openTime) {
    // Early before 1:30 PM
    isOpen = false;
    label = 'Closed Now';
    sub = 'Opens 1:30 PM · Dehiwala & Colombo 03';
  } else {
    // Late night after 11:00 PM
    isOpen = false;
    label = 'Closed Tonight';
    sub = 'Opens 1:30 PM · Dehiwala & Colombo 03';
  }

  // Update UI Elements
  statusLabel.textContent = label;
  if (statusSub) statusSub.textContent = sub;

  if (statusBadge) {
    if (isOpen) {
      statusBadge.classList.remove('is-closed');
      statusBadge.classList.add('is-open');
    } else {
      statusBadge.classList.remove('is-open');
      statusBadge.classList.add('is-closed');
    }
  }

  if (pulseDot) {
    if (isOpen) {
      pulseDot.classList.remove('is-closed');
      pulseDot.classList.add('is-open');
    } else {
      pulseDot.classList.remove('is-open');
      pulseDot.classList.add('is-closed');
    }
  }
}
