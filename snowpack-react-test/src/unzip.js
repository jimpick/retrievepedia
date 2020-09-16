import pify from 'pify'
import yauzl from 'yauzl'
import concat from 'simple-concat'
import stream from 'stream'
import fetch from 'node-fetch'
import { Buffer } from 'buffer-es6'
import 'setimmediate'

// Shim setImmediate() for `yauzl`
// global.setImmediate = process.nextTick.bind(process)
// window.setImmediate = setImmediate

const concatAsync = pify(concat)
const zipFromRandomAccessReaderAsync = pify(yauzl.fromRandomAccessReader)

// module.exports = { openZip, getFile, readEntries }

/**
 * Opens a zip file
 */
export async function openZip () {
  const zipSize = 3470744536
  console.log('fallback hardcoded zip size: ' + zipSize)

  const reader = new ZipRandomAccessReader()
  const zipFile = await zipFromRandomAccessReaderAsync(reader, zipSize, {
    lazyEntries: true,
  })
  zipFile.openReadStreamAsync = pify(zipFile.openReadStream.bind(zipFile))

  return zipFile
}


/**
 * Given a zip file and a filename, extracts file data
 */
export async function getFile (zipFile, entryData) {
  const entryValues = {}
  Object.keys(entryData).forEach(k => {
    entryValues[k] = { value: entryData[k] }
  })
  const entry = Object.create(yauzl.Entry.prototype, entryValues)

  const readStream = await zipFile.openReadStreamAsync(entry)

  const fileData = await concatAsync(readStream)
  return fileData
}

// In zip file entries, directory file names end with '/'
const RE_DIRECTORY_NAME = /\/$/

export async function readEntries (zipFile, fn) {
  fn = fn || (a => a)
  return new Promise((resolve, reject) => {
    const entries = []

    let remainingEntries = zipFile.entryCount

    zipFile.readEntry()
    zipFile.on('entry', onEntry)
    zipFile.once('error', onError)

    function onEntry (entry) {
      remainingEntries -= 1

      if (RE_DIRECTORY_NAME.test(entry.fileName)) {
        // This is a directory entry
        // Note that entires for directories themselves are optional.
        // An entry's fileName implicitly requires its parent directories to exist.
      } else {
        // This is a file entry
        entries.push(fn(entry))
      }

      if (remainingEntries === 0) {
        cleanup()
        resolve(entries)
      } else {
        // Continue reading entries
        zipFile.readEntry()
      }
    }

    function onError (err) {
      cleanup()
      reject(err)
    }

    function cleanup () {
      zipFile.removeListener('entry', onEntry)
      zipFile.removeListener('error', onError)
    }
  })
}

const PAGE_SIZE = 1 << 18

class ZipRandomAccessReader extends yauzl.RandomAccessReader {
  constructor () {
    super()
    this._pagePromiseCache = []
  }

  _readStreamForRange (start, end) {
    console.log('Jim _readStreamForRange', start, end)
    const through = new stream.PassThrough()

    // Convert [start, end) to [start, end]
    readBufsForRange(this, start, end - 1).then(pages => {
      pages.forEach(page => through.write(page))
      through.end()
    })

    return through
  }

  read (buffer, offset, length, position, callback) {
    readBufsForRange(this, position, position + length - 1).then(pages => {
      pages.forEach(page => {
        page.copy(buffer, offset)
        offset += page.length
      })
      callback()
    })
  }
}

/**
 * Reads bit range [start, end], inclusive. Returns buffers to concat.
 */
async function readBufsForRange (reader, start, end) {
  console.log('Jim2 readBufsForRange', start, end)
  // Kick off any fetches not yet started
  const pageStart = Math.floor(start / PAGE_SIZE)
  const pageEnd = Math.floor(end / PAGE_SIZE)
  for (let page = pageStart; page <= pageEnd; page++) {
    let promise = reader._pagePromiseCache[page]
    if (promise == null) {
      promise = reader._pagePromiseCache[page] = readPage(reader, page)
    }
  }

  // Return buffers
  const ret = new Array(pageEnd - pageStart + 1)
  for (let page = pageStart; page <= pageEnd; page++) {
    const promise = reader._pagePromiseCache[page]
    let buf = await promise
    if (page === pageStart && page === pageEnd) {
      buf = buf.slice(start - page * PAGE_SIZE, end - page * PAGE_SIZE + 1)
    } else if (page === pageStart) {
      buf = buf.slice(start - pageStart * PAGE_SIZE, 1 * PAGE_SIZE)
    } else if (page === pageEnd) {
      buf = buf.slice(0, end - pageEnd * PAGE_SIZE + 1)
    }
    ret[page - pageStart] = buf
  }
  return ret
}

function getChunkFileAndOffset (offset) {
  const bigChunkSize = 264241152
  const bigChunkIndex = Math.floor(offset / bigChunkSize)
  const bigChunkOffset = offset % bigChunkSize
  const bigChunkName = `a${String.fromCharCode(
    'a'.charCodeAt(0) + bigChunkIndex,
  )}`
  console.log('Jim bigChunk', bigChunkIndex, bigChunkName, bigChunkOffset)
  const smallChunkSize = 5000000
  const smallChunkIndex = Math.floor(bigChunkOffset / smallChunkSize)
  const smallChunkOffset = bigChunkOffset % smallChunkSize
  const smallFileSize = Math.min(
    bigChunkSize - smallChunkSize * smallChunkIndex,
    smallChunkSize,
  )
  const smallChunkName =
    String.fromCharCode('a'.charCodeAt(0) + Math.floor(smallChunkIndex / 26)) +
    String.fromCharCode('a'.charCodeAt(0) + (smallChunkIndex % 26))
  console.log(
    'Jim smallChunk',
    smallChunkIndex,
    smallChunkName,
    smallChunkOffset,
  )
  return {
    file: `wiki.zip.${bigChunkName}.${smallChunkName}`,
    offset: smallChunkOffset,
    fileSize: smallFileSize
  }
}

async function readPage (reader, page) {
  console.log('loading page ' + page)

  const start = page * PAGE_SIZE
  const end = (page + 1) * PAGE_SIZE - 1
  console.log('Jim readPage', reader._zipPath, start, end)
  const startFile = getChunkFileAndOffset(start)
  console.log('Start', startFile)
  const endFile = getChunkFileAndOffset(end)
  console.log('End', endFile)

  let buf
  if (startFile.file === endFile.file) {
    const size = endFile.offset - startFile.offset
    console.log('Jim1 loading', startFile.file, size)
    const url = `https://lotus.jimpick.com/wiki/${startFile.file}`
    const res = await fetch(url)
    const abuf = await res.arrayBuffer()
    const abuf2 = abuf.slice(startFile.offset, endFile.offset + 1)
    buf = Buffer.from(abuf2)
  } else {
    // First file
    const sizeA = startFile.fileSize - startFile.offset
    console.log('Jim2a loading', startFile.file, sizeA)
    const urlA = `https://lotus.jimpick.com/wiki/${startFile.file}`
    const resA = await fetch(urlA)
    const abufA = await resA.arrayBuffer()
    const abufA2 = abufA.slice(startFile.offset, startFile.fileSize)

    // Second file
    const sizeB = endFile.offset
    console.log('Jim2b loading', endFile.file, sizeB)
    const urlB = `https://lotus.jimpick.com/wiki/${endFile.file}`
    const resB = await fetch(urlB)
    const abufB = await resB.arrayBuffer()
    const abufB2 = abufB.slice(0, endFile.offset)

    const concatABuf = new Uint8Array(abufA2.byteLength + abufB2.byteLength)
    concatABuf.set(new Uint8Array(abufA2), 0)
    concatABuf.set(new Uint8Array(abufB2), abufA2.byteLength)
    buf = Buffer.from(concatABuf)
  }
  console.log('Jim1 buf', buf.length, buf)

  /*
  const headers = new window.Headers({
    Range: `bytes=${start}-${end}`
  })
  */

  // TODO: use simple-get (which uses john's stream-http internally) to
  // return a proper stream back, instead of this solution which waits for
  // the full range request to return before returning the data

  /*
  const res = await window.fetch(reader._zipPath, { headers })
  const abuf = await res.arrayBuffer()
  const buf = Buffer.from(abuf)
  */

  console.log(
    `loaded ${start} to ${end}, ` +
      `expected ${end - start + 1}b, got ${buf.length}b`,
  )

  return buf
}
