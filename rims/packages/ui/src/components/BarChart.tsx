interface BarChartProps {
  data: { label: string; value: number }[];
  title?: string;
  color?: string;
  height?: number;
}

export function BarChart({ data, title, color, height = 300 }: BarChartProps) {
  const leftMargin = 40;
  const bottomMargin = 30;
  const topMargin = 20;
  const rightMargin = 20;
  const viewBoxWidth = 600;
  const viewBoxHeight = 300;

  const chartWidth = viewBoxWidth - leftMargin - rightMargin;
  const chartHeight = viewBoxHeight - topMargin - bottomMargin;

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const barFill = color ?? '#3b82f6';

  if (data.length === 0) {
    return (
      <div style={{ width: '100%' }}>
        {title && (
          <p style={{ textAlign: 'center', fontSize: 13, marginBottom: 4 }}>{title}</p>
        )}
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          width="100%"
          height={height}
          preserveAspectRatio="xMidYMid meet"
          aria-label={title ?? 'Bar chart'}
          role="img"
        >
          <text
            x={viewBoxWidth / 2}
            y={viewBoxHeight / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={14}
            fill="#94a3b8"
          >
            No data available
          </text>
        </svg>
      </div>
    );
  }

  // 5 Y-axis gridlines: 0, 25, 50, 75, 100% of maxValue
  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  const barWidth = (chartWidth / data.length) * 0.7;
  const barStep = chartWidth / data.length;

  return (
    <div style={{ width: '100%' }}>
      {title && (
        <p style={{ textAlign: 'center', fontSize: 13, marginBottom: 4, color: '#475569' }}>
          {title}
        </p>
      )}
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        width="100%"
        height={height}
        preserveAspectRatio="xMidYMid meet"
        aria-label={title ?? 'Bar chart'}
        role="img"
      >
        {/* Y-axis gridlines and labels */}
        {gridLines.map((fraction) => {
          const y = topMargin + chartHeight - fraction * chartHeight;
          const labelValue = Math.round(fraction * maxValue);
          return (
            <g key={fraction}>
              <line
                x1={leftMargin}
                y1={y}
                x2={leftMargin + chartWidth}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth={1}
              />
              <text
                x={leftMargin - 4}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={9}
                fill="#94a3b8"
              >
                {labelValue}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const barH = (d.value / maxValue) * chartHeight;
          const barX = leftMargin + i * barStep + (barStep - barWidth) / 2;
          const barY = topMargin + chartHeight - barH;
          const labelX = leftMargin + i * barStep + barStep / 2;
          const labelY = topMargin + chartHeight + 12;

          return (
            <g key={i}>
              <rect x={barX} y={barY} width={barWidth} height={barH} fill={barFill} rx={2}>
                <title>
                  {d.label}: {d.value}
                </title>
              </rect>
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                fontSize={10}
                fill="#64748b"
                transform={
                  data.length > 6
                    ? `rotate(-35, ${labelX}, ${labelY})`
                    : undefined
                }
              >
                {d.label}
              </text>
            </g>
          );
        })}

        {/* Y axis line */}
        <line
          x1={leftMargin}
          y1={topMargin}
          x2={leftMargin}
          y2={topMargin + chartHeight}
          stroke="#cbd5e1"
          strokeWidth={1}
        />

        {/* X axis line */}
        <line
          x1={leftMargin}
          y1={topMargin + chartHeight}
          x2={leftMargin + chartWidth}
          y2={topMargin + chartHeight}
          stroke="#cbd5e1"
          strokeWidth={1}
        />
      </svg>
    </div>
  );
}
