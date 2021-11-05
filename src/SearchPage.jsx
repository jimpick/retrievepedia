import React from 'react'

import SearchBox from './SearchBox.js'
// import Globe from './Globe.js'

/**
 * Search page; doubles as the Datpedia homepage.
 */
export default class SearchPage extends React.Component {
  render () {
    const { store, dispatch } = this.props

    const styleGlobe = {
      position: 'absolute',
      top: 0,
      left: '10%',
      bottom: 0,
      right: '10%',
      backgroundImage: 'url(./sphere.gif)',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      zIndex: -2
    }

    const styleBlur = {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      filter: 'blur(8px)',
      zIndex: -1
    }

    return (
      <div className='SearchPage'>
        <div style={styleBlur}>
          <div style={styleGlobe} />
        </div>

        <h1>ssshpedia</h1>

        <h2>
          wikipedia over filecoin//<br />
          <hr />
  	  for Slingshot Scavenger Hunt
        </h2>

        <SearchBox store={store} dispatch={dispatch} autoFocus />

	<p>Based on Datpedia</p>
      </div>
    )
  }
}
