const { readdir, stat } = require('fs')
const { promisify } = require('util')

const readdirAsync = promisify(readdir)
const statAsync = promisify(stat)

const IPublisher = require("../interface/ipublisher");

class Listenner extends IPublisher{
    constructor(){
        super()
        this._subscribers = []
    }

    subscribe(folder){
        this._subscribers.push(folder)
    }

    notify(folder){
        folder.update()
    }

    async verifyFolder(){
        let folders = this._subscribers.map(folder => {
            return new Promise(async (resolve, reject) => {
                let folderItens = await readdirAsync(folder.from)
                let isFile = folderItens.map(async item => {
                    let path = `${folder.from}/` + item
                    let result = (await statAsync(path)).isFile()
                    return result
                })
                isFile = await Promise.all(isFile)
                if (isFile.includes(true)){
                    resolve(this.notify(folder))
                }
            })
        })
        let b = await Promise.all(folders)
    }
    
}

module.exports = Listenner