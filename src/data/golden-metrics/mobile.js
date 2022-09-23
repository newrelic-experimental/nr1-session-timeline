const goldenMetricQueries = [
  {
    title: 'HTTP response time (95%) (s)',
    query: `select percentile(responseTime,95) from MobileRequest TIMESERIES `,
  },
  {
    title: 'HTTP errors and network failures',
    query: `select count(*) from MobileRequestError TIMESERIES `,
  },
  {
    title: 'Requests per minute',
    query: `select rate(count(*), 1 minute) from MobileRequest TIMESERIES `,
  },
]

export { goldenMetricQueries }
