import { combineReducers, createStore, applyMiddleware } from 'redux'
import util from 'util'

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

  const logState = () => {
    console.log(
      'STATE',
      util.inspect(store.getState(), {
        depth: 4
      })
    )
  }

  logState()

  console.log('Fetching Ditto...')
  await store.dispatch(pokemonStore.fetchItem('ditto'))

  console.log('Fetching Squirtle...')
  await store.dispatch(pokemonStore.fetchItem('squirtle'))

  console.log('Fetching Raichu...')
  await store.dispatch(pokemonStore.fetchItem('raichu'))

  console.log('Fetching Dragonite...')
  await store.dispatch(pokemonStore.fetchItem('dragonite'))

  logState()
}

runExample()
