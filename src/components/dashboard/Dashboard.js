import React from 'react'
import { Grid, GridItem, LineChart, BillboardChart, Tooltip } from 'nr1'
import { withConfigContext } from '../../context/ConfigContext'
import {
  formatSinceAndCompare,
  formatForDisplay,
} from '../../utils/date-formatter'
import SectionHeader from '../section-header/SectionHeader'

class Dashboard extends React.PureComponent {
  renderChart = ({ type, query }, since) => {
    const {
      entity: { guid, accountId },
      config: { searchAttribute },
      selected,
    } = this.props

    const finalQuery = `${query} MAX WHERE entityGuid = '${guid}' AND ${searchAttribute} = '${selected}' ${since} `
    switch (type) {
      case 'billboard':
        return <BillboardChart accountId={accountId} query={finalQuery} />
      default:
        return <LineChart accountId={accountId} query={finalQuery} />
    }
  }

  renderCharts = since => {
    const { goldenMetricQueries } = this.props

    let colspan = 6
    const metricsNum = goldenMetricQueries.length
    if (metricsNum % 3 === 0) colspan = 4

    return goldenMetricQueries.map((gm, idx) => {
      return (
        <GridItem key={idx} columnSpan={colspan}>
          <div className="chart-container">
            <div className="chart-header">
              <div className="chart-title">
                <Tooltip text={gm.title}>{gm.title}</Tooltip>
              </div>
            </div>
            <div className="detail-chart">{this.renderChart(gm, since)}</div>
          </div>
        </GridItem>
      )
    })
  }

  render() {
    const { timeRange, selected, goldenMetricQueries } = this.props

    if (goldenMetricQueries.length === 0) return <div></div>

    return (
      <div className="dashboard__container">
        <div>
          <SectionHeader
            header={`Golden Metrics for ${selected}`}
            subheader={formatForDisplay(timeRange)}
          />
          <div className="charts__container">
            <Grid gapType={Grid.GAP_TYPE.SMALL}>
              {this.renderCharts(formatSinceAndCompare(timeRange).since)}
            </Grid>
          </div>
        </div>
      </div>
    )
  }
}

export default withConfigContext(Dashboard)
