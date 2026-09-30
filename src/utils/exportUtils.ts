import { ComparisonTableRow } from '../types';

export function exportTableToCSV(
  entities: string[],
  table: ComparisonTableRow[],
  filename = 'CompareIQ_Comparison.csv'
) {
  if (!entities || !table || table.length === 0) return;

  const escapeCSV = (val: string) => {
    const text = val || '';
    if (text.includes(',') || text.includes('"') || text.includes('\n')) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  };

  const headers = ['Attribute / Metric', ...entities];
  const rows = table.map((row) => {
    return [
      row.attribute,
      ...entities.map((entity) => {
        const val = row.values[entity] || row.values[Object.keys(row.values).find(k => k.includes(entity) || entity.includes(k)) || ''] || 'Not mentioned';
        const src = row.sources?.[entity] ? ` (${row.sources[entity]})` : '';
        return `${val}${src}`;
      }),
    ];
  });

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map((r) => r.map(escapeCSV).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function copyTableAsMarkdown(
  entities: string[],
  table: ComparisonTableRow[]
): Promise<boolean> {
  if (!entities || !table || table.length === 0) return Promise.resolve(false);

  const headers = ['Attribute / Metric', ...entities];
  const separator = headers.map(() => '---');

  const rows = table.map((row) => {
    return [
      row.attribute,
      ...entities.map((entity) => {
        const val = row.values[entity] || row.values[Object.keys(row.values).find(k => k.includes(entity) || entity.includes(k)) || ''] || 'Not mentioned';
        return val.replace(/\|/g, '\\|');
      }),
    ];
  });

  const markdown = [
    `| ${headers.join(' | ')} |`,
    `| ${separator.join(' | ')} |`,
    ...rows.map((r) => `| ${r.join(' | ')} |`),
  ].join('\n');

  return navigator.clipboard.writeText(markdown).then(() => true).catch(() => false);
}
