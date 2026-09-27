import site from '../data/site.json'

// Card around a chart: visible title, the chart itself (hidden from screen readers), and a
// visually hidden table with the same numbers so the data never depends on seeing the bars.
export default function ChartFigure({ title, columns, rows, legend, children }) {
  return (
    <figure data-reveal className="glass rounded-2xl p-5">
      <figcaption className="font-mono text-[11px] tracking-[0.2em] text-zinc-600 uppercase dark:text-zinc-400">{title}</figcaption>
      {legend}
      <div aria-hidden="true" className="mt-4">
        {children}
      </div>
      <table className="sr-only">
        <caption>
          {title} ({site.labels.chartTable})
        </caption>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]}>
              {r.map((cell, i) => (i === 0 ? <th key={i} scope="row">{cell}</th> : <td key={i}>{cell}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
