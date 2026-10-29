import site from '../data/site.json'

// Card around a chart: visible title, the chart itself (hidden from screen readers), and a
// visually hidden table with the same numbers so the data never depends on seeing the bars.
export default function ChartFigure({ title, columns, rows, legend, children }) {
  return (
    <figure className="flex h-full flex-col rounded-xl bg-bg/70 p-4">
      <figcaption className="text-sm font-medium text-stone-300">{title}</figcaption>
      {legend}
      <div aria-hidden="true" className="mt-4 flex flex-1 items-center">
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
