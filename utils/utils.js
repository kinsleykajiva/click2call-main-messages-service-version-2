const axios = require("axios");
require('dotenv').config();

const API_BASE_URL = process.env.DEV_NODE_ENVIROMMENT ? 'https://api-app.xxxxxxxxx.com' : 'http://localhost:8050';


async function getNameSpacesList() {
    try {
        let   list =  [];
        let opsys = process.platform;
        if (opsys == "darwin") {
            opsys = "MacOS";
            list=  await axios.get("https://api-app.xxxxxxxxx.com/auth/api/v1/widget/name-spaces");
        } else if (opsys == "win32" || opsys == "win64") {
            opsys = "Windows";
            list = await axios.get(API_BASE_URL + '/auth/api/v1/widget/name-spaces');
        } else if (opsys == "linux") {
            opsys = "Linux";
            list=  await axios.get("https://api-app.xxxxxxxxx.com/auth/api/v1/widget/name-spaces");
        }
        console.log(opsys) // I don't know what linux is.

       /// const list = await axios.get(API_BASE_URL + '/auth/api/v1/widget/name-spaces');
       //  const list = await axios.get("https://api-app.xxxxxxxxx.com/auth/api/v1/widget/name-spaces");
        const response = list.data;
        if (response.success) {
            return response.data.namespaces
        }
        return [];
    } catch (error) {
        console.log(error);
        return [];
    }
}

function saveClientConnection(apiKey,
                              domain,
                              ipAddress,
                              agent) {
    try {
        let url = '';
        let opsys = process.platform;

        if (opsys === "darwin") {

            url = 'https://api-app.xxxxxxxxx.com/stats-service/api/v1/widget/save-connection';

        } else if (opsys === "win32" || opsys === "win64") {

            url = API_BASE_URL + '/stats-service/api/v1/widget/save-connection';

        } else if (opsys === "linux") {

            url = 'https://api-app.xxxxxxxxx.com/stats-service/api/v1/widget/save-connection';
        }
        url = 'https://api-app.xxxxxxxxx.com/stats-service/api/v1/widget/save-connection';
        console.log('saveClientConnection:: ',url)
        axios.post(url, {apiKey,domain,ipAddress, agent   });

    } catch (error) {
        console.log('saveClientConnection',error);

    }
}

function normalizePort(val) {
    console.log('normalizePort', val)
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/*function */


module.exports = {
    normalizePort, getNameSpacesList ,saveClientConnection
}
