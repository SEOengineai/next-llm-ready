'use client';

/**
 * LLMBadge Component
 * Visual indicator that content is AI-ready
 */

import React, { useState } from 'react';
import type { LLMBadgeProps } from '../types';

/**
 * Badge showing content is LLM-ready
 *
 * @example
 * ```tsx
 * <LLMBadge
 *   text="AI Ready"
 *   showTooltip
 *   size="sm"
 * />
 * ```
 */
export function LLMBadge({
  text = 'AI Ready',
  showTooltip = true,
  tooltipContent = 'This content is optimized for AI assistants like ChatGPT and Claude',
  size = 'md',
  className = '',
}: LLMBadgeProps) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const badgeClasses = [
    'llm-ready-badge',
    `llm-ready-badge-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={badgeClasses}
      onMouseEnter={() => showTooltip && setIsTooltipVisible(true)}
      onMouseLeave={() => setIsTooltipVisible(false)}
      onFocus={() => showTooltip && setIsTooltipVisible(true)}
      onBlur={() => setIsTooltipVisible(false)}
      tabIndex={showTooltip ? 0 : -1}
      role={showTooltip ? 'tooltip' : undefined}
      aria-describedby={showTooltip ? 'llm-badge-tooltip' : undefined}
    >
      {/* AI/LLM icon */}
      <svg
        width={size === 'sm' ? 12 : size === 'lg' ? 18 : 14}
        height={size === 'sm' ? 12 : size === 'lg' ? 18 : 14}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="llm-ready-badge-icon"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
        <path d="m4.93 4.93 2.83 2.83m8.48 8.48 2.83 2.83m0-14.14-2.83 2.83m-8.48 8.48-2.83 2.83" />
      </svg>
      <span className="llm-ready-badge-text">{text}</span>

      {/* Tooltip */}
      {showTooltip && isTooltipVisible && (
        <div id="llm-badge-tooltip" className="llm-ready-badge-tooltip" role="tooltip">
          {tooltipContent}
        </div>
      )}
    </div>
  );
}

export default LLMBadge;
