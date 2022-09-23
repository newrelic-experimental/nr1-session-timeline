import { goldenMetricQueries as browserQueries } from './browser'
import { goldenMetricQueries as mobileQueries } from './mobile'

const readFromGraphQL = ({ data }) => {
  const goldenMetricQueries = data?.entities?.[0]?.goldenMetrics?.metrics?.reduce(
    (acc, gm) => {
      acc.push({ title: gm.title, query: gm.query })
      return acc
    },
    []
  )

  return goldenMetricQueries
}

const readFromFile = ({ type }) => {
  let queries

  switch (type) {
    case 'MOBILE':
      queries = mobileQueries
      break
    default:
      queries = browserQueries
  }

  return queries
}

const DEFAULT = readFromFile

const read = val => DEFAULT(val)

export { read }
