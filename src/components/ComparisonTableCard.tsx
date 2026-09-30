import React, { useState } from 'react';
import { ComparisonTableRow } from '../types';
import { exportTableToCSV, copyTableAsMarkdown } from '../utils/exportUtils';
import { Download, Copy, Check, Info } from 'lucide-react';

interface ComparisonTableCardProps {
  summary?: string;
  entities?: string[];
  table?: ComparisonTableRow[];
  insights?: string[];
}

export const ComparisonTableCard: React.FC<ComparisonTableCardProps> = ({
  summary,
  entities = [],
  table = [],
  insights = [],
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // If entities list is empty, derive from table keys
  const resolvedEntities =
    entities.length > 0
      ? entities
      : Array.from(
          new Set(
            table.flatMap((row) => Object.keys(row.values || {}))
          )
        );

  const handleCopy = async () => {
    const success = await copyTableAsMarkdown(resolvedEntities, table);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportCSV = () => {
    exportTableToCSV(resolvedEntities, table);
  };

  return (
    <div className="w-full bg-[#FFFFFF] rounded-2xl border border-[#D2EBD9] shadow-xs overflow-hidden my-3">
      {/* Header section with summary */}
      <div className="p-5 border-b border-[#EAF6EE]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="text-xs font-semibold tracking-wider uppercase text-[#3D604C]">
            Here's how they compare
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1F3D2B] bg-[#EAF6EE] hover:bg-[#def2e4] rounded-lg transition-colors cursor-pointer"
              title="Copy as Markdown table"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#1F3D2B]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#1F3D2B]" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#FFFFFF] bg-[#7FB88F] hover:bg-[#71a980] rounded-lg transition-colors cursor-pointer"
              title="Export table as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {summary && (
          <p className="text-sm font-medium text-[#1F3D2B] leading-relaxed">
            {summary}
          </p>
        )}
      </div>

      {/* Side-by-side Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse min-w-[540px]">
          <thead>
            <tr className="bg-[#EAF6EE] text-[#1F3D2B] border-b border-[#D2EBD9]">
              <th className="sticky left-0 z-10 bg-[#EAF6EE] py-3.5 px-4 font-semibold text-xs uppercase tracking-wider min-w-[160px] max-w-[220px]">
                Attribute / Metric
              </th>
              {resolvedEntities.map((entity, idx) => (
                <th
                  key={idx}
                  className="py-3.5 px-4 font-semibold text-xs tracking-wider min-w-[190px]"
                >
                  <div className="truncate max-w-[240px]" title={entity}>
                    {entity}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAF6EE]">
            {table.map((row, rowIdx) => {
              const isEven = rowIdx % 2 === 0;
              const rowBg = isEven ? 'bg-[#FFFFFF]' : 'bg-[#EAF6EE]/40';
              const stickyBg = isEven ? 'bg-[#FFFFFF]' : 'bg-[#EAF6EE]';

              return (
                <tr key={rowIdx} className={`${rowBg} transition-colors hover:bg-[#EAF6EE]/70`}>
                  {/* Sticky attribute column */}
                  <td
                    className={`sticky left-0 z-10 ${stickyBg} py-3 px-4 font-medium text-[#1F3D2B] text-xs leading-snug min-w-[160px] max-w-[220px] border-r border-[#EAF6EE]`}
                  >
                    {row.attribute}
                  </td>

                  {/* Value columns */}
                  {resolvedEntities.map((entity, colIdx) => {
                    // Match entity or fallback
                    const val =
                      row.values[entity] ??
                      row.values[
                        Object.keys(row.values).find(
                          (k) =>
                            k.toLowerCase() === entity.toLowerCase() ||
                            entity.toLowerCase().includes(k.toLowerCase()) ||
                            k.toLowerCase().includes(entity.toLowerCase())
                        ) || ''
                      ] ??
                      'Not mentioned';

                    const source =
                      row.sources?.[entity] ??
                      row.sources?.[
                        Object.keys(row.sources || {}).find(
                          (k) =>
                            k.toLowerCase() === entity.toLowerCase() ||
                            entity.toLowerCase().includes(k.toLowerCase())
                        ) || ''
                      ];

                    const isMissing =
                      !val ||
                      val.toLowerCase().includes('not mentioned') ||
                      val.toLowerCase().includes('n/a') ||
                      val === '—';

                    const cellKey = `${rowIdx}-${colIdx}`;
                    const isTooltipOpen = activeTooltip === cellKey;

                    return (
                      <td
                        key={colIdx}
                        className="py-3 px-4 text-[#1F3D2B] text-xs align-top relative group"
                        onClick={() =>
                          source && setActiveTooltip(isTooltipOpen ? null : cellKey)
                        }
                      >
                        <div className="flex flex-col gap-1">
                          <span
                            className={
                              isMissing
                                ? 'italic text-[#5C806B]'
                                : 'font-normal leading-relaxed'
                            }
                          >
                            {val}
                          </span>

                          {/* Source citation tag (hover/tap) */}
                          {source && (
                            <div className="mt-1 flex items-center gap-1">
                              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-[#EAF6EE] text-[#3D604C] border border-[#D2EBD9] transition-opacity">
                                <Info className="w-2.5 h-2.5 text-[#7FB88F] shrink-0" />
                                <span className="truncate max-w-[180px]" title={source}>
                                  {source}
                                </span>
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Key Takeaways / Insights */}
      {insights && insights.length > 0 && (
        <div className="p-4 bg-[#EAF6EE]/50 border-t border-[#D2EBD9]">
          <div className="text-xs font-semibold text-[#1F3D2B] uppercase tracking-wider mb-2">
            Key Differences & Takeaways
          </div>
          <ul className="space-y-1.5 text-xs text-[#1F3D2B]">
            {insights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7FB88F] mt-1.5 shrink-0" />
                <span className="leading-relaxed">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
