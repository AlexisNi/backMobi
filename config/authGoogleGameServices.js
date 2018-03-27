
module.exports =function (req,res,next) {
  console.log('/=======INSIDE==========/');
  let token =req.token;
  let CLIENT_ID=req.client;
  const {OAuth2Client} = require('google-auth-library');
  const client = new OAuth2Client(CLIENT_ID);

  async function verify() {
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
  }));

}


