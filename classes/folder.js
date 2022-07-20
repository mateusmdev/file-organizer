const { readdir, stat, mkdir, rename, existsSync } = require('fs')
const { promisify } = require('util')
const IOberver = require("../interface/iobserver");

const readdirAsync = promisify(readdir)
const statAsync = promisify(stat)
const mkdirAsync = promisify(mkdir)
const renameAsync = promisify(rename)

class Folder extends IOberver {
    constructor(from, to) {
        super()
        this._from = from
        this._to = to
    }

    get from() {
        return this._from
    }

    get to() {
        return this._to
    }

    async createFolder() {
        let { files, folders } = await this.getItens()
        let extensions = files.map(file => {
            let filetype = file.split('.')
            if (filetype.length > 1) 
                filetype = filetype[filetype.length - 1]
            else 
                filetype = 'outros'

            return filetype
        })
        extensions = [...new Set(extensions)]

        extensions.forEach(async filetype => {
            try {
                if (filetype in folders === false) {
                    await mkdirAsync(this._to + '/' + filetype)
                }
            } catch (error) { }
        })

    }

    async moveFiles() {
        let { files, folders } = await this.getItens()

        files.forEach(async file => {
            let filepath = this._handleDuplicatedFiles(file)
            await renameAsync(`${this._from}/${file}`, filepath)
        })
    }

    async getItens() {
        let folderItens = await readdirAsync(this._from)
        let itens = {}

        let itensPromisses = folderItens.map(async item => {
            let path = `${this._from}/` + item
            let result = (await statAsync(path)).isFile()

            return new Promise((resolve, reject) => {
                itens['files'] = itens['files'] || []
                itens['folders'] = itens['folders'] || []

                if (result) {
                    itens['files'].push(item)
                } else {
                    itens['folders'].push(item)
                }
                resolve()
            })
        })

        await Promise.all(itensPromisses)
        return itens
    }

    _handleDuplicatedFiles(file) {
        let extension = file.split('.')

        if (extension.length > 1) 
            extension = extension[extension.length - 1]
        else 
            extension = 'outros'

        let result = existsSync(this._to + `/${extension}/` + file)
        if (result === false) return this._to + `/${extension}/` + file

        let count = 1
        while (true) {
            let newFile
            if (result) {

                let filename = file.split('.')
                filename = filename.slice(0, filename.length - 1)
                filename = filename.join('.')
                filename = filename + `(${count}).${extension}`

                newFile = this._to + `/${extension}/` + filename
                count++
                result = existsSync(newFile)

                if (result === false) return newFile
            }
        }
    }

    async update() {
        await this.createFolder()
        await this.moveFiles()
    }
}

module.exports = Folder