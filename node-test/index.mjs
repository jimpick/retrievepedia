import { openZip, getFile } from './unzip.mjs'

const vancouver = {
  urlName: 'Vancouver',
  name: 'Vancouver',
  searchName: 'vancouver',
  compressedSize: 57455,
  relativeOffsetOfLocalHeader: 1807062212,
  compressionMethod: 8,
  generalPurposeBitFlag: 0
}

const zipFilePromise = openZip('/wiki.zip')

async function loadArticle () {
  const zipFile = await zipFilePromise
  const entryData = vancouver
  const html = await getFile(zipFile, entryData)
  console.log(`loaded article, got ${html && html.length} b`)
  console.log('html:\n', html.toString())
}

loadArticle()

