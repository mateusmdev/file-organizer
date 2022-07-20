const NotImplementedException = require("../exception/notImplemented")

class IPublisher{
    subscribe(){
        throw new NotImplementedException()
    }

    unsubscribe(){
        throw new NotImplementedException()
    }

    notify(subscriber){
        throw new NotImplementedException()
    }
}

module.exports = IPublisher