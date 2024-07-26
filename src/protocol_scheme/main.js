const { protocol, net } = require("electron");
const path = require("path");


protocol.registerSchemesAsPrivileged([
    {
        scheme: "local",
        privileges: {
            standard: false,
            allowServiceWorkers: true,
            corsEnabled: false,
            supportFetchAPI: true,
            stream: true,
            bypassCSP: true
        }
    }
]);


exports.protocolRegister = (protocol) => {
    if (!protocol.isProtocolRegistered("local")) {
        protocol.handle("local", (req) => {
            const { host, pathname } = new URL(decodeURI(req.url));
            const filepath = path.normalize(pathname.slice(1));
            switch (host) {
                case "root": return net.fetch(`file:///${LiteLoader.path.root}/${filepath}`);
                case "profile": return net.fetch(`file:///${LiteLoader.path.profile}/${filepath}`);
                default: return net.fetch(`file://${host}/${filepath}`);
            }
        });
    }
}