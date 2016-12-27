const path = require('path')
const Readable = require('stream').Readable
const Vinyl = require('vinyl')
const data = require('gulp-data')
const requirePug = require('../lib/index')

describe('gulp-require-pug', () => {
  it('normal', done => {
    const mock = mockStream()

    mock
      .pipe(requirePug())
      .on('data', expectData('var normal = "<h1>Test</h1>"'))
      .on('end', done)

    emitFile(mock, 'var normal = require("./fixtures/normal.pug")')
  })

  it('data', done => {
    const mock = mockStream()

    mock
      .pipe(requirePug({ data: { test: 'Hi' }}))
      .on('data', expectData('var data = "<div data-test=\\"Hi\\">Hi</div>"'))
      .on('end', done)

    emitFile(mock, 'var data = require(\'./fixtures/data.pug\')')
  })

  it('extend', done => {
    const mock = mockStream()

    mock
      .pipe(requirePug({ basedir: path.resolve(__dirname) }))
      .on('data', expectData('var extend = "<h1>layout</h1><div><p>contents</p></div>";'))
      .on('end', done)

    emitFile(mock, 'var extend = require("./fixtures/extend.pug");')
  })

  it('gulp-data', done => {
    const mock = mockStream()

    mock
      .pipe(data({ test: 'gulp-data' }))
      .pipe(requirePug())
      .on('data', expectData('var data = "<div data-test=\\"gulp-data\\">gulp-data</div>"'))
      .on('end', done)

    emitFile(mock, 'var data = require(\'./fixtures/data.pug\')')
  })
})

function mockStream () {
  const mock = new Readable()
  mock._read = () => {}
  return mock
}

function emitFile (mock, contents) {
  const base = __dirname
  mock.emit('data', new Vinyl({
    cwd: process.cwd(),
    base,
    path: path.join(base, 'test.js'),
    contents: Buffer.from(contents)
  }))
  mock.emit('end')
}

function expectData (out) {
  return file => {
    expect(file.contents.toString().trim()).toBe(out.trim())
  }
}
