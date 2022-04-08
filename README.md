## Charon - NodeJS Server SDK

This is the NodeJS server SDK for Charon: A new form of secure, passwordless authentication.

The SDK currently serves as a layer built on top of the **Charon Authentication server API.** With support for verifying users as an express middleware function and setting up pre-built endpoints for your client to interact with. Works well when paired with any **CharonClient** libraries (such as charonclientnode).

This SDK can be used client side, however it is strongly discouraged to do so doing this would **compromise your API token.**

#### Before you start
1. Create your app on Charon
2. Create a new instance of the CharonServer with the APIKey
3. Use the different functions supported by the API

### Express setup using the pre-built endpoints (for easy use with any CharonClient SDKs)
```javascript
    var app = express();
    var charonServer = new CharonAPIEndpoints("API TOKEN HERE");

    //our endpoints use async code by default

    //endpoint for creating a new user
    app.post('/api/v1/charon/create',charonServer.createUserEndpoint);

    //endpoint for getting all pending device sign ins for a particular user
    app.post('/api/v1/charon/pending',charonServer.getPendingAuthDevicesEndpoint);

    //endpoint for requesting a login to an account from a device
    app.post('/api/v1/charon/login',charonServer.requestLoginEndpoint);
    
    //endpoint for authenticate a pending login request
    app.post('/api/v1/charon/authenticate',charonServer.authenticatePendingEndpoint);

    app.listen(8080);
```
### Using the verifyAccount middleware for any endpoints that require authentication to use (such as creating a post)

```javascript
    var app = express();
    app.use(express.bodyParser());

    var charonServer = new CharonServer("API TOKEN HERE");

    //for requests that require authentication, ADD THE USERNAME AND KEY OF THE ACCOUNT TO THE HTTP POST BODY
    app.post('/post/create',charonServer.verifyAccountMiddleware,async function(req,res,next){
        if(req.charon.auth == true){
        //write your own post logic here:
        //EXAMPLE
        PostHandler.createPost(req.charon.username,{'test':req.body.test});

        }else if(req.charon.auth == false){
            res.json({'status':'invalidkey'});
        }
    });

```