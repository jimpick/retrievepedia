import React, { useState } from 'react'
import './App.css'
import SearchPage from './SearchPage.jsx'
import ArticlePage from './ArticlePage.jsx'

function App (props) {
  const { store, dispatch } = props
  const { urlName } = store
  console.log('rendering', urlName || 'search page')

  if (urlName != null) {
    return <ArticlePage store={store} dispatch={dispatch} />
  } else {
    return <SearchPage store={store} dispatch={dispatch} />
  }
  /*
  return (
    <div className='App' style={{textAlign: 'left'}}>
      <h1>Jim</h1>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  )
  */
}

export default App
