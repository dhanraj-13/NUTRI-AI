const fs = require('fs');

const toCsv = (rows) => {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [headers.join(',')];
  for (const row of rows) lines.push(headers.map((h) => esc(row[h])).join(','));
  return lines.join('\n');
};

const writeCsv = (filePath, rows) => {
  fs.writeFileSync(filePath, toCsv(rows), 'utf8');
  return filePath;
};

module.exports = { writeCsv };
