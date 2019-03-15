import { combineReducers, createStore, applyMiddleware } from 'redux'

import { middleware, dataStore } from '../src'

async function runExample() {
  const dataStoreMiddleware = middleware({
    baseUrl: 'https://pokeapi.co/api/v2'
  })

  const pokemonStore = dataStore({
    storeName: 'pokemon',
    baseUrl: '/pokemon'
  })

  const reducer = combineReducers({
    pokemon: pokemonStore.reducer
  })

  const store = createStore(reducer, applyMiddleware(dataStoreMiddleware))

  console.log('INITIAL STATE', store.getState())

  await store.dispatch(pokemonStore.fetchItem('ditto'))
}

runExample()
