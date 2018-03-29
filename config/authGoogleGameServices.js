
module.exports = (req,res,next) => {
  console.log('/=======INSIDE==========/');

  const clientJson=require('../client_secret_1094475455230-p1ptvr9t3c46k4so2pbjfpmht91i1jm5.apps.googleusercontent.com.json');
  let auth =req.body.auth;
  let CLIENT_ID=clientJson.web.client_id;
  const {OAuth2Client} = require('google-auth-library');
  const client = new OAuth2Client(CLIENT_ID);
  const {google} = require('googleapis');
  const OAuth2 = google.auth.OAuth2;

  const oauth2Client = new OAuth2(
    clientJson.web.client_id,
    clientJson.web.client_secret,
    clientJson.web.redirect_uris
  );


   oauth2Client.getToken(auth, (err, tokens) => {
    console.log('inside get token')
    if(err){
      res.status(500).json({
        title: 'Auth is not verified !!',
        message: 'Please try again later',
        error:"err"
      })


    }

    if(tokens){
      res.status(200).json({
        title: 'Token has been succesfull verified !!',
        message: 'You can now login to the app',
        status: '200',
        token:tokens
      })

    }
  });






/*  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    return res.status(500).json({
      title: 'Token has been succesfull verified !!',
      message: 'You can now login to the app',
      status: '200'
    })
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
  }
  verify().catch(
    res.status(500).json({
    where: 'Token play game services',
    title: 'Token not valid',
    message: 'We couldnt verify you please try login again',
    status: '500'
  }));*/

}


