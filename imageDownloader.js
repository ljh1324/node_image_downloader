const net = require('net');
const fs = require('fs');

const makeRequestMessage = (url, port) => {
  let message = '';
  message += `GET ${url.href} HTTP/1.1\r\n`;
  message += `Host: ${url.host}:${port}\r\n`;
  message += '\r\n';

  return message;
}

const httpDownloader = (downloadPath, path) => {
  const downloadURL = new URL(downloadPath);
  let port;
  let bufferArray = [];

  switch (downloadURL.protocol) {
    case 'http:': port = 80; break;
    case 'https:': port = 443; break;
  }

  const client = net.connect({
    port,
    host: downloadURL.host
  });

  client.on('connect', () => {
    client.write(makeRequestMessage(downloadURL, port));
  });

  client.on('data', (data) => {
    bufferArray.push(data);
  });


  client.on('close', () => {
    const result = Buffer.concat(bufferArray);
    console.log(result);
    fs.writeFileSync(path, result.toString());
  });
}