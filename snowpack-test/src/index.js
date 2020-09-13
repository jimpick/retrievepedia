import { openZip, getFile } from './unzip.js'

const vancouver = {
  urlName: 'Vancouver',
  name: 'Vancouver',
  searchName: 'vancouver',
  compressedSize: 57455,
  relativeOffsetOfLocalHeader: 1807062212,
  compressionMethod: 8,
  generalPurposeBitFlag: 0
}

const calgary = {
  "urlName": "Calgary",
  "name": "Calgary",
  "searchName": "calgary",
  "compressedSize": 25096,
  "relativeOffsetOfLocalHeader": 2946574730,
  "compressionMethod": 8,
  "generalPurposeBitFlag": 0
}

const toronto = {
  "urlName": "Toronto",
  "name": "Toronto",
  "searchName": "toronto",
  "compressedSize": 46461,
  "relativeOffsetOfLocalHeader": 2107635556,
  "compressionMethod": 8,
  "generalPurposeBitFlag": 0
}

const montreal = {
  "urlName": "Montréal",
  "name": "Montréal",
  "searchName": "montreal",
  "compressedSize": 49875,
  "relativeOffsetOfLocalHeader": 3270681223,
  "compressionMethod": 8,
  "generalPurposeBitFlag": 2048
}

const winnipeg = {
  "urlName": "Winnipeg",
  "name": "Winnipeg",
  "searchName": "winnipeg",
  "compressedSize": 62923,
  "relativeOffsetOfLocalHeader": 496302773,
  "compressionMethod": 8,
  "generalPurposeBitFlag": 0
}

const edmonton = {
  "urlName": "Edmonton",
  "name": "Edmonton",
  "searchName": "edmonton",
  "compressedSize": 16517,
  "relativeOffsetOfLocalHeader": 1123419278,
  "compressionMethod": 8,
  "generalPurposeBitFlag": 0
}

const zipFilePromise = openZip('/wiki.zip')

async function loadArticle () {
  const zipFile = await zipFilePromise
  // const entryData = vancouver
  const entryData = calgary // crosses boundary
  // const entryData = toronto
  // const entryData = montreal
  // const entryData = winnipeg
  // const entryData = edmonton
  const html = await getFile(zipFile, entryData)
  console.log(`loaded article, got ${html && html.length} b`)
  // console.log('html:\n', html.toString())
  document.body.innerHTML = html.toString()
}

loadArticle()

