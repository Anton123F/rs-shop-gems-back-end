const http = require('http');
const url = require('url');
const axios = require('axios');

const apis = {
  'test-url': process.env.TEST_URL || '',
  'products-url': process.env.PRODUCTS_URL || '',
  'bad-request': process.env.BAD_REQUEST || '',
  'post-request': process.env.POST_REQUEST || '',
  'get-request': process.env.GET_REQUEST || '',
  'get-products': process.env.GET_PRODUCTS || '',
  'server-b-test': 'http://localhost:3000/test-api',
  'server-b-bad-request': 'http://localhost:3000/bad-400-request'
};

const server = http.createServer(async (req, res) => {
  try {
    const parsedUrl = url.parse(req.url, true);
    const parsedUrlSegment = parsedUrl.pathname.split('/').filter(Boolean);

    if (parsedUrlSegment.length < 1) {
      res.writeHead(502, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({error: 'Bad Request: Recipient service name is missing'}));
      return;
    }

    const recipientServiceName = parsedUrlSegment[0]; //extract from url recipientURL name
    const recipientPath = apis[recipientServiceName]; //get recipientURL actual URL from .env
    const queryParam = parsedUrl.query && parsedUrl.query.var1 || null; // get query param

    //check if application is working (for test purpose)
    if (recipientServiceName === 'test-api') {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('server is working!!!');
      return;
    }

    //if there is no path inside .env
    if (!recipientPath) {
      res.writeHead(502, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({error: 'Cannot process request'}));
      return;
    }

    //construct new url based on service name and params
    const finalUrl = queryParam ? `${recipientPath}/${queryParam}` : recipientPath;

    try {
      const response = await axios({
        method: req.method,
        url: finalUrl,
        data: (req.method !== 'GET' && req.method !== 'HEAD') ? req : undefined,
        responseType: 'stream'
      });

      //handle success 200
      if (response.status === 200) {
        res.writeHead(response.status, response.headers);
        response.data.pipe(res);
      } else {
        //if response success but not 200
        let body = '';
        response.data.on('data', (chunk) => {
          body += chunk;
        });
        response.data.on('end', () => {
          res.writeHead(response.status, {'Content-Type': 'application/json'});
          res.end(JSON.stringify({error: `Received non-200 response status: ${response.status}`, details: body}));
        });
      }
    } catch (error) {
      if (error.response) {
        // Read the error response body
        let errorBody = '';
        error.response.data.on('data', (chunk) => {
          errorBody += chunk;
        });
        error.response.data.on('end', () => {
          console.log('Error status:', error.response.status);
          console.log('Error data:', errorBody);

          const errorStatus = error.response.status;
          res.writeHead(errorStatus, {'Content-Type': 'application/json'});
          res.end(errorBody);
        });
      } else {
        console.log(`error response from remote API that unable to handle`)
        console.error('Error:', error.message);
        res.writeHead(502, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: `Bad Gateway: ${error.message}`}));
      }
    }
  } catch (error) {
    console.log(`error that prevent send request at all`)
    console.log(error);
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end('Internal Server Error');
  }
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
  console.log('test if .env environment is not empty');
  console.log(apis['get-products']);
});