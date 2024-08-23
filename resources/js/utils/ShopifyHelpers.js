import currency from 'currency.js';

export function renderAmount(value) {
  let amountRaw, amount;
  if (config.currencySymbol == '€') {
    amountRaw = formatCentsToDollars(value);

    amount = currency(amountRaw, {
      symbol: config.currencySymbol,
      decimal: ',',
      separator: ' ',
      pattern: `#!`,
      fromCents: true,
      precision: 0,
    }).format(true);
  } else {
    amountRaw = formatCentsToDollars(value);
    amount = currency(amountRaw, {
      symbol: config.currencySymbol,
      decimal: ',',
      separator: '.',
    }).format(true);
  }

  return amount;
}

export function formatCentsToDollars(value) {
  value = (value + '').replace(/[^\d.-]/g, '');
  value = parseFloat(value);
  return value ? value / 100 : 0;
}

export function formatDollarsToCents(value) {
  value = (value + '').replace(/[^\d.-]/g, '');
  value = parseFloat(value);
  return value ? value * 100 : 0;
}

export function makeExternalLinks() {
  var links = document.links;
  for (let i = 0, linksLength = links.length; i < linksLength; i++) {
    if (links[i].hostname !== window.location.hostname) {
      links[i].target = '_blank';
      links[i].rel = 'noreferrer noopener';
    }
  }
}
