import http from 'http'
import data from './data.js'
const PORT = 9000

const server = http.createServer((req, res) => {
    const httpMethod = req.method
    const option = {
        'Content-Type': 'application/json'
    }

    if (httpMethod == 'GET') {
        res.writeHead(200, option)
        res.end(JSON.stringify(data))
        return
    }
    if (httpMethod == 'POST') {
        req.on('data', chunk => {
            const body = JSON.parse(chunk)
            data.push({
                id: data.at(-1)?.id + 1 || 1,
                ...body,
            })
            res.writeHead(201, option)
            res.end(JSON.stringify({
                message: 'object created'
            }))
            return
        })
    }
    if (httpMethod == 'PATCH') {
        const bookId = req.url.split('/')[1]
        if (!bookId) {
            res.writeHead(404, option)
            res.end(JSON.stringify({
                message: 'not found'
            }))
            return
        }
        const book = data.find(e => e.id == bookId)
        if (!book) {
            res.writeHead(404, option)
            res.end(JSON.stringify({
                message: 'book not found'
            }))
            return
        }

        req.on('data', chunk => {
            const { title, author, price } = JSON.parse(chunk)

            book.title = title ?? book.title
            book.author = author ?? book.author
            book.price = price ?? book.price

            const bookIndex = data.findIndex(e => e.id == bookId)
            data.splice(bookIndex, 1)
            data.push(book)
            res.writeHead(204, option)
            res.end(JSON.stringify({
                message: 'object updated'
            }))
            return
        })
    }
    if (httpMethod == 'DELETE') {
        const bookId = req.url.split('/')[1]
        const book = data.find(e => e.id == bookId)

        if (!book) {
            res.writeHead(404, option)
            res.end(JSON.stringify({
                message: 'Not found'
            }))
            return
        }
        const bookIndex = data.findIndex(e => e.id == bookId)
        data.splice(bookIndex, 1)

        res.writeHead(200, option)
        res.end(JSON.stringify({
            message: 'object deleted'
        }))
        return
    }

})
server.listen(PORT, () => {
    console.log('listening...');
})