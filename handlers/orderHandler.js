class OrderHandler {
    setNext(handler) {
        this.nextHandler = handler;
        return handler;
    }

    async handle(request) {
        if (this.nextHandler) {
            return await this.nextHandler.handle(request);
        }
        return null;
    }
}

module.exports = OrderHandler;