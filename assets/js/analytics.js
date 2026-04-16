window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function gtag(){window.dataLayer.push(arguments);};

window.gtag('js', new Date());
window.gtag('config', 'G-CN4M2R2NVR', {
  page_path: window.location.pathname,
  page_title: document.title,
  page_location: window.location.href,
});

function getLinkLabel(link) {
  return (
    link.dataset.analyticsLabel ||
    (link.textContent || '').trim() ||
    link.getAttribute('aria-label') ||
    link.href
  );
}

function getSectionName(link) {
  const section = link.closest('[data-analytics-section]');
  if (section) return section.dataset.analyticsSection;

  const header = link.closest('header');
  if (header) return 'header';

  const nav = link.closest('nav');
  if (nav) return 'nav';

  return 'page';
}

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href]');
  if (!link) return;

  const url = new URL(link.href, window.location.href);
  const label = getLinkLabel(link);
  const section = getSectionName(link);

  window.gtag('event', 'section_click', {
    section,
    link_text: label,
    link_url: url.href,
    page_location: window.location.href,
  });

  if (url.origin !== window.location.origin) {
    window.gtag('event', 'outbound_click', {
      section,
      link_text: label,
      link_url: url.href,
      page_location: window.location.href,
    });
  }
});

const scrollMilestones = [25, 50, 75, 90];
const sentScrollMilestones = new Set();

function reportScrollDepth() {
  const scrollTop = window.scrollY || window.pageYOffset;
  const viewportHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollableHeight = documentHeight - viewportHeight;

  if (scrollableHeight <= 0) return;

  const scrollPercent = Math.round((scrollTop / scrollableHeight) * 100);

  for (const milestone of scrollMilestones) {
    if (scrollPercent >= milestone && !sentScrollMilestones.has(milestone)) {
      sentScrollMilestones.add(milestone);
      window.gtag('event', 'scroll_depth', {
        percent_scrolled: milestone,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }
}

window.addEventListener('scroll', reportScrollDepth, { passive: true });
window.addEventListener('load', reportScrollDepth);
