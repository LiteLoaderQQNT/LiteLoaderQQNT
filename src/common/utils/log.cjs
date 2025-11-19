class Log {
    static info(...message) {
        console.info("\x1b[32m%s\x1b[0m", "[LiteLoader]", ...message);
    }
    static warn(...message) {
        console.warn("\x1b[33m%s\x1b[0m", "[LiteLoader]", ...message);
    }
    static error(...message) {
        console.error("\x1b[31m%s\x1b[0m", "[LiteLoader]", ...message);
    }
}

module.exports = { Log };
