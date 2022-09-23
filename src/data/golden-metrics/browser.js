const goldenMetricQueries = [
  {
    title: 'Throughput (ppm)',
    query: `SELECT rate(count(*), 1 minute) FROM PageView TIMESERIES `,
  },
  {
    title: 'Largest contentful paint (75 percentile) (s)',
    query: `select percentile(largestContentfulPaint, 75) from PageViewTiming TIMESERIES `,
  },
  {
    title: 'First input delay (75 percentile) (ms)',
    query: `select percentile(firstInputDelay, 75) from PageViewTiming TIMESERIES `,
  },
  {
    title: 'Errors',
    query: `select count(*) from JavaScriptError TIMESERIES `,
  },
  {
    title: 'Pageload time (s)',
    query: `select average(duration) from PageView TIMESERIES `,
  },
  {
    title: 'Ajax throughput (rpm)',
    query: `select rate(count(*), 1 MINUTE) from AjaxRequest TIMESERIES `,
  },
]

export { goldenMetricQueries }
