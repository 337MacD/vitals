// ─── Notification System ───
// Schedules a local notification for 11pm daily when the app is open.
// Note: PWA notifications on iOS require the app to be added to home screen.
// This fires reliably when the app is open or backgrounded; if the app is
// fully closed/killed, the notification won't fire (no server-side push).

let scheduled = false;

export async function initNotifications() {
  if (!('Notification' in window)) return false;

  if (Notification.permission === 'default') {
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') return false;
  }

  if (Notification.permission === 'granted') {
    scheduleEveningReminder();
    return true;
  }

  return false;
}

function scheduleEveningReminder() {
  if (scheduled) return;
  scheduled = true;

  const now = new Date();
  const target = new Date(now);
  target.setHours(23, 0, 0, 0); // 11:00 PM

  let ms = target - now;
  if (ms < 0) {
    // Already past 11pm today, skip
    return;
  }

  setTimeout(async () => {
    try {
      // Prefer service worker notification (works when app is backgrounded)
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        const reg = await navigator.serviceWorker.ready;
        await reg.showNotification('Vitals', {
          body: "Don't forget to log your day!",
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: 'daily-reminder',
          renotify: false,
        });
      } else {
        // Fallback to basic notification
        new Notification('Vitals', {
          body: "Don't forget to log your day!",
          icon: '/icon-192.png',
        });
      }
    } catch (e) {
      console.warn('Notification failed:', e);
    }
    // Reset for next schedule if app stays open
    scheduled = false;
  }, ms);
}

export function getNotificationStatus() {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission; // 'granted', 'denied', 'default'
}
