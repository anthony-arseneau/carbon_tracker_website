import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

const TrajectorySection = () => {
  const d3Container = useRef(null);

  // Extrapolated based on the BBC/Climate Action Tracker data image. GtCO2e.
  const projectionData = [
    { year: 2020, noActMin: 60, noActMax: 65, policiesMin: 50, policiesMax: 55, pledgesMin: 50, pledgesMax: 53 },
    { year: 2040, noActMin: 70, noActMax: 90, policiesMin: 50, policiesMax: 62, pledgesMin: 45, pledgesMax: 55 },
    { year: 2060, noActMin: 80, noActMax: 140, policiesMin: 40, policiesMax: 60, pledgesMin: 30, pledgesMax: 45 },
    { year: 2080, noActMin: 80, noActMax: 160, policiesMin: 40, policiesMax: 58, pledgesMin: 25, pledgesMax: 38 },
    { year: 2100, noActMin: 80, noActMax: 180, policiesMin: 38, policiesMax: 55, pledgesMin: 25, pledgesMax: 35 }
  ];

  // Themed to match MainCounter exactly (Colors, Glows, Typography)
  const consequenceCards = [
    {
      title: "IF COUNTRIES DO NOT ACT",
      range: "4.1 - 4.8°C",
      unit: "WARMING EXPECTED",
      color: "#B91C1C", // MainCounter Critical Red
      glow: "0 0 20px rgba(185, 28, 28, 0.5), 0 0 40px rgba(185, 28, 28, 0.3)",
      consequences: [
        "Widespread crop failures & global famine risk",
        "Multi-meter sea level rise (eventual, lock-in)",
        "Complete ecosystem collapse & mass extinctions",
        "Massive global societal & economic disruption"
      ]
    },
    {
      title: "CURRENT POLICIES (ENACTED)",
      range: "2.8 - 3.2°C",
      unit: "WARMING EXPECTED",
      color: "#FF9F43", // MainCounter Budget Orange
      glow: "0 0 20px rgba(255, 159, 67, 0.5), 0 0 40px rgba(255, 159, 67, 0.3)",
      consequences: [
        "Severe, multi-decadal heatwaves become the norm",
        "Significant sea level rise (eventual)",
        "High risk of reaching critical climate tipping points",
        "Severely reduced agricultural yields and water access"
      ]
    },
    {
      title: "CURRENT PLEDGES (NOT ENACTED)",
      range: "2.5 - 2.8°C",
      unit: "WARMING EXPECTED",
      color: "#00D2FC", // MainCounter Spend Blue
      glow: "0 0 20px rgba(0, 210, 252, 0.5), 0 0 40px rgba(0, 210, 252, 0.3)",
      consequences: [
        "Dangerous coastal flood risks for major cities",
        "Increased frequency of severe weather and storms",
        "Increased pressure on food and water security",
        "A chance to adapt, with extreme investment"
      ]
    }
  ];

  useEffect(() => {
    if (d3Container.current) {
      d3.select(d3Container.current).selectAll('*').remove();

      const margin = { top: 40, right: 150, bottom: 40, left: 40 }; 
      const width = 900 - margin.left - margin.right;
      const height = 450 - margin.top - margin.bottom;

      const svg = d3.select(d3Container.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // 1. Scales
      const x = d3.scaleLinear()
        .domain(d3.extent(projectionData, d => d.year))
        .range([0, width]);
      
      const y = d3.scaleLinear()
        .domain([0, 200])
        .range([height, 0]);

      // 2. Axes (Removed grid lines and domain/axis lines)
      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickValues([2020, 2040, 2060, 2080, 2100]).tickFormat(d3.format('d')))
        .attr('color', '#64748b') // Keep neutral for axes
        .call(g => g.select('.domain').remove())
        .selectAll('text')
        .style('font-size', '14px')
        .style('font-family', 'monospace');

      svg.append('g')
        .call(d3.axisLeft(y).tickValues([0, 50, 100, 150, 200])) 
        .attr('color', '#64748b')
        .call(g => g.select('.domain').remove())
        .selectAll('text')
        .style('font-size', '14px')
        .style('font-family', 'monospace');

      // Top-Left Y-Axis Label
      svg.append('text')
        .attr('x', -32)
        .attr('y', -20)
        .attr('text-anchor', 'start')
        .attr('fill', '#94a3b8')
        .style('font-family', 'monospace')
        .style('font-size', '12px')
        .style('letter-spacing', '0.05em')
        .text('GtCO₂e (GIGATONNES CO₂ EQUIVALENT)');

      // 3. Area Generators
      const areaNoAct = d3.area().x(d => x(d.year)).y0(d => y(d.noActMin)).y1(d => y(d.noActMax)).curve(d3.curveMonotoneX);
      const areaPolicies = d3.area().x(d => x(d.year)).y0(d => y(d.policiesMin)).y1(d => y(d.policiesMax)).curve(d3.curveMonotoneX);
      const areaPledges = d3.area().x(d => x(d.year)).y0(d => y(d.pledgesMin)).y1(d => y(d.pledgesMax)).curve(d3.curveMonotoneX);

      // 4. Draw Uncertainty Areas (using exact MainCounter hex colors)
      svg.append('path').datum(projectionData).attr('fill', '#00D2FC').attr('fill-opacity', 0.15).attr('d', areaPledges);
      svg.append('path').datum(projectionData).attr('fill', '#FF9F43').attr('fill-opacity', 0.15).attr('d', areaPolicies);
      svg.append('path').datum(projectionData).attr('fill', '#B91C1C').attr('fill-opacity', 0.15).attr('d', areaNoAct);

      // 5. Draw Solid Mean Lines
      const lineNoAct = d3.line().x(d => x(d.year)).y(d => y((d.noActMin + d.noActMax) / 2)).curve(d3.curveMonotoneX);
      const linePolicies = d3.line().x(d => x(d.year)).y(d => y((d.policiesMin + d.policiesMax) / 2)).curve(d3.curveMonotoneX);
      const linePledges = d3.line().x(d => x(d.year)).y(d => y((d.pledgesMin + d.pledgesMax) / 2)).curve(d3.curveMonotoneX);

      svg.append('path').datum(projectionData).attr('fill', 'none').attr('stroke', '#00D2FC').attr('stroke-width', 2).attr('d', linePledges);
      svg.append('path').datum(projectionData).attr('fill', 'none').attr('stroke', '#FF9F43').attr('stroke-width', 2).attr('d', linePolicies);
      svg.append('path').datum(projectionData).attr('fill', 'none').attr('stroke', '#B91C1C').attr('stroke-width', 2).attr('d', lineNoAct);

      // 6. Direct Text Labels
      const lastData = projectionData[projectionData.length - 1];
      const labelX = x(lastData.year) + 15;

      const redLabel = svg.append('text').attr('x', labelX).attr('y', y((lastData.noActMin + lastData.noActMax) / 2) - 15).attr('fill', '#B91C1C').attr('font-size', '11px').attr('font-family', 'monospace');
      redLabel.append('tspan').attr('x', labelX).attr('dy', 0).style('font-weight', 'bold').attr('font-size', '13px').text('4.1 - 4.8°C');
      redLabel.append('tspan').attr('x', labelX).attr('dy', '1.3em').text("IF COUNTRIES");
      redLabel.append('tspan').attr('x', labelX).attr('dy', '1.4em').text("DO NOT ACT");

      const greenLabel = svg.append('text').attr('x', labelX).attr('y', y((lastData.policiesMin + lastData.policiesMax) / 2) - 10).attr('fill', '#FF9F43').attr('font-size', '11px').attr('font-family', 'monospace');
      greenLabel.append('tspan').attr('x', labelX).attr('dy', 0).style('font-weight', 'bold').attr('font-size', '13px').text('2.8 - 3.2°C');
      greenLabel.append('tspan').attr('x', labelX).attr('dy', '1.3em').text("CURRENT POLICIES");
      greenLabel.append('tspan').attr('x', labelX).attr('dy', '1.4em').text("(ENACTED)");

      const blueLabel = svg.append('text').attr('x', labelX).attr('y', y((lastData.pledgesMin + lastData.pledgesMax) / 2) + 5).attr('fill', '#00D2FC').attr('font-size', '11px').attr('font-family', 'monospace');
      blueLabel.append('tspan').attr('x', labelX).attr('dy', 0).style('font-weight', 'bold').attr('font-size', '13px').text('2.5 - 2.8°C');
      blueLabel.append('tspan').attr('x', labelX).attr('dy', '1.3em').text("CURRENT PLEDGES");
      blueLabel.append('tspan').attr('x', labelX).attr('dy', '1.4em').text("(NOT ENACTED)");

      // 7. Timeline Markers & Breaches (on the Amber Path)
      const currentYearX = 2026;
      const currentYearY = 54; 
      
      const currentMarker = svg.append('g').attr('transform', `translate(${x(currentYearX)},${y(currentYearY)})`);
      currentMarker.append('circle')
        .attr('r', 5)
        .attr('fill', '#f8fafc')
        .attr('class', 'animate-pulse'); 
      currentMarker.append('circle')
        .attr('r', 8)
        .attr('fill', 'none')
        .attr('stroke', '#f8fafc')
        .attr('stroke-width', 1)
        .attr('class', 'animate-ping opacity-50'); 
      currentMarker.append('text')
        .attr('x', 0)
        .attr('y', -15)
        .attr('text-anchor', 'middle')
        .attr('fill', '#f8fafc')
        .attr('font-size', '11px')
        .attr('font-family', 'monospace')
        .attr('font-weight', 'bold')
        .text('WE ARE HERE');

      const breach2050X = 2050.6;
      const breach2050Y = 53.5;
      
      svg.append('circle').attr('cx', x(breach2050X)).attr('cy', y(breach2050Y)).attr('r', 4).attr('fill', '#FF9F43');
      const label2050 = svg.append('text')
        .attr('x', x(breach2050X) - 10)
        .attr('y', y(breach2050Y) - 12)
        .attr('text-anchor', 'middle')
        .attr('fill', '#FF9F43')
        .attr('font-size', '11px')
        .attr('font-family', 'monospace')
        .attr('font-weight', 'bold')
      label2050.append('tspan').attr('x', x(breach2050X)).attr('dy', 0).text('2.0°C BREACH');

      const breach2080X = 2080;
      const breach2080Y = 49; 
      
      svg.append('circle').attr('cx', x(breach2080X)).attr('cy', y(breach2080Y)).attr('r', 4).attr('fill', '#FF9F43');
      const label2080 = svg.append('text')
        .attr('x', x(breach2080X) - 10)
        .attr('y', y(breach2080Y) - 12)
        .attr('text-anchor', 'middle')
        .attr('fill', '#FF9F43')
        .attr('font-size', '11px')
        .attr('font-family', 'monospace')
        .attr('font-weight', 'bold')
      label2080.append('tspan').attr('x', x(breach2080X)).attr('dy', 0).text('3.0°C BREACH');

    }
  }, [projectionData]);

  return (
    <>
    <div className="border border-dark-border rounded-xl bg-dark-card overflow-hidden">
      {/* Section header */}
      <div className="px-8 pt-8 pb-4">
        <p className="text-[10px] tracking-[0.3em] text-muted-text uppercase font-mono mb-1">
          Projection Models
        </p>
        <h2 className="text-sm md:text-base font-bold tracking-widest font-mono text-slate-200 uppercase">
          Future Emissions & Warming Trajectories
        </h2>
        <p className="text-[11px] text-muted-text font-mono tracking-wide mt-2 max-w-4xl leading-relaxed">
          This visualization compares three global climate paths, from worst-case inaction to meeting current (yet often not enacted) pledges. We are currently tracking along the amber path.
        </p>
      </div>

      <div className="w-full overflow-x-auto flex justify-center bg-dark-card py-4">
        <div ref={d3Container} className="min-w-[900px]" />
      </div>

      
    </div>
    {/* Themed Context Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 pt-4">
        {consequenceCards.map((card, index) => (
          <div
            key={index}
            className="border border-dark-border rounded-lg bg-dark-card p-6 text-center"
          >
            {/* Top Label */}
            <p className="text-[10px] tracking-[0.3em] text-muted-text mb-4 uppercase font-mono">
              {card.title}
            </p>

            {/* Glowing Value */}
            <p
              className="text-2xl md:text-3xl font-bold tabular-nums mb-1"
              style={{ color: card.color, textShadow: card.glow }}
            >
              {card.range}
            </p>

            {/* Sub-Label */}
            <p className="text-[11px] text-muted-text font-mono tracking-[0.1em] mb-6">
              {card.unit}
            </p>

            <div className="w-full h-px bg-dark-border mb-5 opacity-50"></div>

            {/* Bullet List (Left-Aligned for readability) */}
            <ul className="space-y-3 text-left">
              {card.consequences.map((consequence, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[10px] mt-1" style={{ color: card.color }}>▶</span>
                  <span className="text-[11px] text-slate-300 font-mono tracking-wide leading-relaxed">
                    {consequence}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      </>
  );
};

export default TrajectorySection;