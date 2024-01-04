import express from "express";
import { login } from "../../controllers/authController";
import settingModel from "../../models/settingModel";
const axios = require("axios");
const crypto = require("crypto");

const router = express.Router();
// Step 1: Redirect the user to the Salla authorization endpoint
router.get("/aliexpress/authorize", async (req, res) => {
  const sallaCredentials = await settingModel.find({
    settingID: req.query.settingID,
  });
  const result = sallaCredentials[0];

  const clientId = result.aliExpress.appID;
  const redirectUri = "https://prismcodehub.com/aliexpress";

  const authorizationUrl = "https://api-sg.aliexpress.com/oauth/authorize";
  const authorizationLink = `${authorizationUrl}?response_type=code&force_auth=true&redirect_uri=${redirectUri}&client_id=${clientId}`;

  res.redirect(authorizationLink);
});

// Step 1: Redirect the user to the Salla authorization endpoint
router.get("/salla_account/authorize", async (req, res) => {
  const sallaCredentials = await settingModel.find({
    settingID: req.query.settingID,
  });
  const result = sallaCredentials[0];

  const clientId = result.sallaAccount.clientID;
  const clientSecret = result.sallaAccount.clientSecretKey;
  const redirectUri = "http://localhost:4000/salla_account/callback/1865370236";

  const authorizationUrl = "https://accounts.salla.sa/oauth2/auth";
  const scope = "offline_access";
  const state = "12345678";

  const authorizationLink = `${authorizationUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;

  res.redirect(authorizationLink);
});

router.get("/getToken", async (req, res) => {
  const appKey = "503950";
  const appSecret = "nJU3gn6b9nGCl9Ohxs7jDg33ROqq3WTZ";
  const code = "3_503950_HHFc7RdiuxkDUPZDr1TWinDN1825";
  const timestamp = Date.now().toString();
  const signMethod = "sha256";
  const apiPath = "/auth/token/create";

  // Step 1: Populate parameters
  const parameters: Record<string, string> = {
    app_key: appKey,
    timestamp: timestamp,
    sign_method: signMethod,
    code: code,
  };

  // If using System Interface, add the API name into parameters
  // parameters['method'] = apiPath;

  // Step 2: Sort parameters
  const sortedParameters = Object.keys(parameters)
    .sort()
    .reduce((acc, key) => {
      acc[key] = parameters[key];
      return acc;
    }, {} as Record<string, string>);

  // Step 3: Concatenate parameters
  const queryString = Object.keys(sortedParameters)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(
          sortedParameters[key]
        )}`
    )
    .join("&");

  // If using System Interface, add the API name to the concatenated string
  // const concatenatedString = `${apiPath}${queryString}`;

  // Step 4: Generate signature
  const signatureString = `/auth/token/create${queryString}`;
  const hmac = crypto.createHmac("sha256", Buffer.from(appSecret, "utf-8"));
  hmac.update(signatureString);
  const signature = hmac.digest("hex").toUpperCase();

  // Step 5: Assemble main URL
  const mainUrl = `https://api-sg.aliexpress.com/rest${apiPath}?${queryString}&sign_method=${signMethod}&sign=${signature}`;

  // res.redirect(mainUrl)
  const result = await axios.post(mainUrl);
  res.status(200).json({ data: result.data, mainURILDataCommingFrom: mainUrl });
});

router.post("/login", login);

export default router;
