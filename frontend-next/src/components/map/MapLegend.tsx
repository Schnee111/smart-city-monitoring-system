'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LegendItem {
  color: string;
  label: string;
  ring?: boolean;
}

interface LegendGroup {
  category: string;
  items: LegendItem[];
}

export default function MapLegend() {
  const [isExpanded, setIsExpanded] = useState(true);

  const legendItems: LegendGroup[] = [
    {
      category: 'Energy Source',
      items: [
        { color: 'bg-amber-500', label: 'Solar Power' },
        { color: 'bg-blue-500', label: 'Grid Power' },
      ],
    },
    {
      category: 'Status',
      items: [
        { color: 'bg-emerald-500', label: 'Active', ring: true },
        { color: 'bg-amber-500', label: 'Maintenance', ring: true },
        { color: 'bg-red-500', label: 'Offline', ring: true },
      ],
    },
    {
      category: 'Load Indicator',
      items: [
        { color: 'bg-emerald-500', label: 'Normal (< 5 kWh)' },
        { color: 'bg-amber-500', label: 'Medium (5-10 kWh)' },
        { color: 'bg-red-500', label: 'High (> 10 kWh)' },
      ],
    },
  ];

  return (
    <div className="absolute top-16 left-4 z-[1000]">
      <div className="bg-slate-800/95 border border-slate-600 rounded-lg overflow-hidden backdrop-blur-sm min-w-[180px]">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-slate-700/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-white">Legend</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-slate-700"
            >
              <div className="p-3 space-y-3">
                {legendItems.map((group) => (
                  <div key={group.category}>
                    <p className="text-xs font-medium text-slate-400 mb-1.5">
                      {group.category}
                    </p>
                    <div className="space-y-1.5">
                      {group.items.map((item) => (
                        <div key={item.label} className="flex items-center gap-2">
                          <div className="relative">
                            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                            {item.ring && (
                              <div className={`absolute inset-0 rounded-full ${item.color} opacity-30 scale-150`}></div>
                            )}
                          </div>
                          <span className="text-xs text-slate-300">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
