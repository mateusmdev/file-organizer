require('dotenv').config()
const Listenner = require('./classes/listenner')
const Folder = require('./classes/folder')

class FileOrganizer {
    static async main() {
        let listenner = new Listenner()

        const folderPath = process.env.PATH_FOLDER
        console.log(folderPath)
        let folder = new Folder(folderPath, folderPath)
        
        listenner.subscribe(folder)

        setInterval(async () => {
            await listenner.verifyFolder()
        }, 5000)

    }
}

FileOrganizer.main()
