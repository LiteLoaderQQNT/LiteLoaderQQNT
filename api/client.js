function API_PATH(path) {
    const host = betterQQNT.net.host;
    const port = betterQQNT.net.port;
    return `http://${host}:${port}${path}`;
}


async function read_file_text(params = {
    path: ""
}) {
    const url = API_PATH("/fs/read_file_text");
    const init = {
        method: "POST",
        body: JSON.stringify(params)
    }
    const res = await fetch(url, init);
    return res.ok ? await res.text() : null;
}


async function read_file_blob(params = {
    path: ""
}) {
    const url = API_PATH("/fs/read_file_blob");
    const init = {
        method: "POST",
        body: JSON.stringify(params)
    }
    const res = await fetch(url, init);
    return res.ok ? await res.blob() : null;
}


// API
betterQQNT["api"] = {
    fs: {
        read_file_text,
        read_file_blob
    }
}