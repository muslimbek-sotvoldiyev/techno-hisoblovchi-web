'use strict';

function parseAmount(text) {
  const value = Number(String(text).trim().replace(',', '.'));
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function calculate(sections, radiatorMeters, floorSquareMeters) {
  const powers = [sections * 0.21, radiatorMeters * 2.5, floorSquareMeters * 0.25];
  const total = powers.reduce((sum, power) => sum + power, 0);
  const boiler = total > 0 ? [25, 35, 50, 75, 100, 200].find(capacity => total <= capacity + 1e-9) : undefined;
  return { powers, total, boiler };
}

if (typeof document !== 'undefined') {
  const ids = ['sections', 'radiator', 'floor'];
  const inputs = ids.map(id => document.getElementById(id));
  const number = value => value.toFixed(2).replace('.', ',');
  function update() {
    const amounts = inputs.map(input => parseAmount(input.value));
    const result = calculate(...amounts);
    ids.forEach((id, index) => {
      document.getElementById(`${id}-result`).textContent = `${number(result.powers[index])} kW`;
    });
    document.getElementById('total').replaceChildren(document.createTextNode(`${number(result.total)} `), Object.assign(document.createElement('span'), { textContent: 'kW' }));
    document.getElementById('boiler').textContent = result.total === 0 ? 'Miqdorlarni kiriting' : result.boiler ? `${result.boiler} kW` : '200 kW dan yuqori quvvat kerak';
  }
  inputs.forEach((input, index) => {
    let previous = '';
    input.addEventListener('input', () => {
      const pattern = index === 0 ? /^\d*$/ : /^\d*([.,]\d*)?$/;
      if (pattern.test(input.value) && (input.value === '' || Number.isFinite(Number(input.value.replace(',', '.'))))) previous = input.value;
      else input.value = previous;
      update();
    });
    input.addEventListener('change', () => { previous = input.value; });
  });
  document.getElementById('calculator').addEventListener('submit', event => event.preventDefault());
  document.getElementById('calculator').addEventListener('reset', () => {
    inputs.forEach(input => { input.value = ''; input.dispatchEvent(new Event('input')); });
    update();
  });
  update();
}

if (typeof module !== 'undefined') module.exports = { parseAmount, calculate };
