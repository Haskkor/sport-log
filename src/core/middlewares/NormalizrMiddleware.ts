import { normalize, schema } from 'normalizr'
import * as lodash from 'lodash'

// FIXME all entities in this file is un typed

// *****
// * define all the schema types here
// *****
// TODO remove the examples
const schemaTypes = {
  chartData: 'chartData',
  contactInfo: 'contactInfo',
  instrument: 'instrument',
  notifications: 'notifications',
  reports: 'reports',
  transactions: 'transactions',
  parties: 'parties',
  holdings: 'holdings',
  portfolio: 'portfolio',
  accounts: 'accounts',
  accountParties: 'accountParties',
  advisers: 'advisers',
  portfolioSummaries: 'portfolioSummaries',
  txdocs: 'txdocs',
  region: 'region',
  sector: 'sector',
  analysts: 'analysts',
  research : 'research',
  searchItems: 'searchItems',
  quotes: 'quotes'
}
const baseSchemas = lodash.mapValues(schemaTypes, (type) => new schema.Entity(type))
// *****
// * define all the schema details here - for schemas that are nested
// *****
// TODO remove the examples
// baseSchemas[schemaTypes.instrument] = new schema.Entity(schemaTypes.instrument, {}, { idAttribute: 'symbol' })
// baseSchemas[schemaTypes.quotes] = new schema.Entity(schemaTypes.quotes, {}, { idAttribute: 'symbol' })
// baseSchemas[schemaTypes.research] = new schema.Entity(schemaTypes.research, {}, { idAttribute: 'filename' })
// baseSchemas[schemaTypes.parties].define({
//   contactInfo: [baseSchemas[schemaTypes.contactInfo]]
// })
//
// baseSchemas[schemaTypes.portfolio].define({
//   holdings: [baseSchemas[schemaTypes.holdings]]
// })

// *****
// * define all the schema to handle the response - ie. what the root of the response looks like
// *****
// TODO remove the examples
export const responseSchemasTypes = {
  parties: 'parties',
  transactions: 'transactions',
  chartData: 'chartData',
  instrument: 'instrument',
  notifications: 'notifications',
  reports: 'reports',
  txdocs: 'txdocs',
  portfolio: 'portfolio',
  me: 'me',
  region: 'region',
  sector: 'sector',
  analysts: 'analysts',
  searchItems: 'searchItems',
  holdingTransaction: 'holdingTransaction',
  quotes : 'quotes',
  research: 'research'
}

const responseSchemas = {
  [responseSchemasTypes.parties]: {
    parties: [baseSchemas.parties]
  },
  [responseSchemasTypes.transactions]: {
    transactions: [baseSchemas.transactions]
  },
  [responseSchemasTypes.chartData]: {
    chartData: [baseSchemas.chartData]
  },
  [responseSchemasTypes.notifications]: {
    notifications: [baseSchemas.notifications]
  },
  [responseSchemasTypes.reports]: {
    reports: [baseSchemas.reports]
  },
  [responseSchemasTypes.portfolio]: {
    portfolios: [baseSchemas.portfolio]
  },
  [responseSchemasTypes.me]: {
    accounts: [baseSchemas.accounts],
    advisers: [baseSchemas.advisers],
    parties: [baseSchemas.parties],
    accountParties: [baseSchemas.accountParties],
    notifications: [baseSchemas.notifications],
    portfolioSummaries: [baseSchemas.portfolioSummaries]
  },
  [responseSchemasTypes.instrument]: {
    instrument: [baseSchemas.instrument]
  },
  [responseSchemasTypes.txdocs]: {
    txdocs: [baseSchemas.txdocs]
  },
  [responseSchemasTypes.region]: {
    region: [baseSchemas.region]
  },
  [responseSchemasTypes.sector]: {
    sector: [baseSchemas.sector]
  },
  [responseSchemasTypes.analysts]: {
    analysts: [baseSchemas.analysts],
    research: [baseSchemas.research]
  },
  [responseSchemasTypes.searchItems]: {
    searchItems: [baseSchemas.searchItems]
  },
  [responseSchemasTypes.holdingTransaction]: {
    transactions: [baseSchemas.transactions]
  },
  [responseSchemasTypes.quotes]: {
    quotes: [baseSchemas.quotes]
  },
  [responseSchemasTypes.research]: {
    research: [baseSchemas.research]
  }
}

function doNormalizeRequest(action: any) {
  if (!action.payload || !action.payload.schema) return

  const responseSchema = responseSchemas[action.payload.schema]

  if (!responseSchema) {
    console.warn('Unknown response normalizr schema type', action.payload.schema)
  }

  if (!action.payload.response) {
    console.warn('A response in payload is required for normalizr', action)
  }

  action.payload.normalized = normalize(
    action.payload.response.data,
    responseSchema
  )
}

export default function normalizeMiddleware() {
  return (next: any) => (action: any) => {
    doNormalizeRequest(action)
    return next(action)
  }
}
