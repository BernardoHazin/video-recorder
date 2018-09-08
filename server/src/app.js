const app = require('express')()
const server = require('http').createServer(app)
const formidable = require('formidable')
const util = require('util')
const cors = require('cors')
const fs = require('fs')

app.use(cors())

app.get('/', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'video/mp4'
  })
  const stream = fs.createReadStream('/home/hazin/Videos/upload.mp4')
  stream.pipe(res)
})

app.post('/', (req, res) => {
  const form = new formidable.IncomingForm()
  form.uploadDir = '/home/hazin/Videos'
  form.keepExtensions = true
  // form.on('fileBegin', function (name, file) {
  //   file.path = '/home/hazin/Videos/upload.mp4' 
  // })
  form.on('file', function (name, file) {
    console.log('file', file)
  })
  form.parse(req, function(err, fields, files) {
    // console.log(files)
    res.end(util.inspect({fields: fields, files: files}))
  })
})

server.listen(3000, () => console.log('Server started!'))