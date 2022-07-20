const NotImplementedException = require("../exception/notImplemented")


class IOberver{
    update(){
        throw new NotImplementedException()
    }
}

module.exports = IOberver