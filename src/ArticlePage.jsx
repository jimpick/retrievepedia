import React from 'react'
import SearchBox from './SearchBox.jsx'

/**
 * Shows a Wikipedia article, with a search bar at the top.
 */
export default class ArticlePage extends React.Component {
  render () {
    const { store, dispatch } = this.props
    const { articleCache, urlName } = store

    if (urlName == null) return null

    const isSearching = store.search != null
    const name = urlName.replace(/_/g, ' ')

    const html =
      articleCache[urlName] || '<h1>' + name + '</h1><p>Loading...</p>'

    return (
      <div className='ArticlePage'>
        <header>
          <a href='#'>Retrievepedia</a>
          <SearchBox store={store} dispatch={dispatch} whiteBg />
        </header>
        <div
          className={'ArticleBody' + (isSearching ? ' deemphasized' : '')}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    )
  }
}
