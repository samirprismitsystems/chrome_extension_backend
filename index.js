const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const jwt = require("jsonwebtoken");
const jwksRsa = require("jwks-rsa");
const settingModel = require("./models/settingModel");
const userModel = require("./models/userModel");
const setupDB = require("./services/database");
const utils = require("./utils/utils");
const crypto = require("crypto");
const axios = require("axios");

const errorHandler = require("./middlewares/errorHandler");
dotenv.config();

const app = express();
const port = process.env.PORT;

const jwksUri = "https://samirqureshi.us.auth0.com/.well-known/jwks.json";
const audience = "this is identifier";
const issuerBaseURL = "https://samirqureshi.us.auth0.com/";

async function load() {
  await setupDB();
}

load();

// Middleware`
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cors());

// get the access token for the ali express
// app.get("/api/auth/getToken", async (req, res) => {
//   try {
//     const url = "https://api-sg.aliexpress.com/sync";
//     const appKey = "503950";
//     const appSecret = "nJU3gn6b9nGCl9Ohxs7jDg33ROqq3WTZ";

//     const params = {
//       app_key: appKey,
//       code: req.query.code,
//       format: "json",
//       method: "/auth/token/create",
//       sign_method: "md5",
//       timestamp: Date.now(),
//     };

//     const sortedParams = {};
//     Object.keys(params)
//       .sort()
//       .forEach((key) => {
//         sortedParams[key] = params[key];
//       });

//     // Step 2: Concatenate parameters
//     let parameters = "";
//     for (const [key, value] of Object.entries(sortedParams)) {
//       if (!parameters) {
//         parameters = `${key}=${value}`;
//       } else {
//         parameters += `&${key}=${encodeURIComponent(value)}`;
//       }
//     }

//     console.log("-------------------------")

//     // Step 3: Replace characters in the sign string
//     let sign = parameters.replace(/&/g, "").replace(/=/g, "");
//     const signatureString = `${appSecret}${sign}${appSecret}`;
//     const signature = crypto
//       .createHash("md5")
//       .update(signatureString, "utf-8")
//       .digest("hex")
//       .toUpperCase();

//     // Step 5: Assemble final URL
//     const finalUrl = `${url}?${parameters}&sign=${signature}`;
// console.log("-------------------------", finalUrl);
//     // Make HTTP request using Axios
//     const result = await axios.post(finalUrl, null, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
//       },
//     });

//     res.status(200).json({
//       data: result.data,
//       main: `https://api-sg.aliexpress.com/auth/token/create?code=${req.query.code}`,
//       mainURILDataCommingFrom: finalUrl,
//     });

//     // const code = req.query.code;
//     // const timestamp = Date.now().toString();
//     // const signMethod = "md5"; // Change to md5
//     // const apiPath = "/auth/token/create";
//     // const params = {
//     //   app_key: appKey,
//     //   sign_method: signMethod,
//     //   code: code,
//     //   timestamp: timestamp,
//     // };

//     // // Step 1: Sort parameters
//     // const sortedParams = Object.fromEntries(Object.entries(params).sort());

//     // // Step 2: Concatenate parameters
//     // let parameters = "";
//     // for (const [key, value] of Object.entries(sortedParams)) {
//     //   parameters += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
//     // }

//     // // Remove the trailing "&" character
//     // parameters = parameters.slice(0, -1);

//     // // Step 3: Generate signature
//     // const signatureString = `${appSecret}${parameters}${appSecret}`;
//     // const signature = crypto
//     //   .createHash("md5")
//     //   .update(signatureString, "utf-8")
//     //   .digest("hex")
//     //   .toUpperCase();

//     // // Step 5: Assemble main URL

//     // const mainUrl = `https://api-sg.aliexpress.com/rest${apiPath}?${parameters}&sign_method=${signMethod}&sign=${signature}`;

//     // const result = await axios.post(mainUrl);
//   } catch (error) {
//     console.error("Error in /api/auth/getToken:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

app.get("/api/auth/getToken", async (req, res) => {
  try {
    const url = "https://api-sg.aliexpress.com/sync";
    const appKey = "503950"; // Replace with your actual client_id
    const appSecret = "nJU3gn6b9nGCl9Ohxs7jDg33ROqq3WTZ"; // Replace with your actual client_secret

    let param = {};
    param["app_key"] = appKey;
    param["code"] = req.query.code;
    param["format"] = "json";
    param["method"] = "/auth/token/create";
    param["sign_method"] = "md5";
    param["timestamp"] = Math.floor(Date.now() / 1000);

    // Sorting the object properties by key
    const sortedParameters = Object.fromEntries(Object.entries(param).sort());

    let parameters = "";
    for (const [key, value] of Object.entries(sortedParameters)) {
      if (!parameters) {
        parameters = `${key}=${value}`;
      } else {
        parameters += `&${key}=${encodeURIComponent(value)}`;
      }
    }

    let sign = parameters.replace(/&/g, "").replace(/=/g, "");
    const signString = appSecret + sign + appSecret;
    const finalSign = await axios.get(
      `https://prismcodehub.com/aliexpress?md5=${signString}`
    );

    console.log(finalSign, " finalSign");

    //const md5Hash = crypto.createHash("md5").update(signString).digest("hex");
    //const finalSign = md5Hash.toUpperCase();

    const finalUrl = `${url}?${new URLSearchParams(sortedParameters)}&sign=${
      finalSign.data
    }`;

    const result = await axios.post(finalUrl, new URLSearchParams(param), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    res.status(200).json({
      data: result.data,
      finalSign: finalSign,
      mainURL: finalUrl,
    });

    // // Sorting the object properties by key
    // param = Object.fromEntries(Object.entries(param).sort());

    // let parameters = "";
    // for (const [key, value] of Object.entries(param)) {
    //   if (!parameters) {
    //     parameters = `${key}=${value}`;
    //   } else {
    //     parameters += `&${key}=${encodeURIComponent(value)}`;
    //   }
    // }

    // let sign = parameters.replace(/&/g, "").replace(/=/g, "");

    // const signatureString = `${appSecret}${sign}${appSecret}`;

    // const md5Hash = crypto
    //   .createHash("md5")
    //   .update(appSecret + sign + appSecret)
    //   .digest("hex");
    // const signature = md5Hash.toUpperCase();

    // const finalUrl = `${url}?${parameters}&sign=${signature}`;

    // const response = await axios.post(finalUrl, param, {
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    //   },
    // });

    // res.status(200).json({ data: response.data, finalUrl });

    // // Step 3: Replace characters in the sign string

    // // Step 4: Generate signature
    // const signatureString = `${appSecret}${sign}${appSecret}`;
    // const signature = crypto
    //   .createHash("md5")
    //   .update(signatureString, "utf-8")
    //   .digest("hex")
    //   .toUpperCase();

    // // Step 5: Assemble final URL
    // const finalUrl = `${url}?${parameters}&sign=${signature}`;

    // // Make HTTP request using Axios
    // const response = await axios.post(finalUrl, null, {
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    //   },
    // });

    // res.status(200).json(response.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// sall account callback uri
app.get("/api/salla_account/callback", async (req, res) => {
  try {
    const { code } = req.query;
    const clientId = objSalla.clientID || null;
    const clientSecret = objSalla.clientSecret || null;
    const redirectUri = "https://chrome-extension-frontend.vercel.app/settings";

    // Step 3: Exchange the authorization code for an access token
    const tokenUrl = "https://accounts.salla.sa/oauth2/token";
    const tokenData = {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
      scope: "offline_access",
    };

    const tokenResponse = await axios.post(tokenUrl, tokenData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // The response will contain the access token and other information
    const accessToken = tokenResponse.data.access_token;
    const refreshToken = tokenResponse.data.refresh_token;
    // Handle the tokens as needed...

    res.status(200).json({
      accessToken,
      refreshToken,
      tokenURL: tokenUrl,
      redirectURI: `https://chrome-extension-frontend.vercel.app/dashboard?accessToken=${accessToken}`,
    });
  } catch (error) {
    console.error(
      "Error exchanging authorization code for access token:",
      error
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ali express account callback uri
app.get("/ali_express_account/callback/1865370236", async (req, res) => {
  const { code } = req.query;
  const settingID = req.query.settingID;

  if (!settingID) {
    res
      .status(200)
      .json(utils.getResponse(true, [], "Setting ID is not present!"));
  }

  const sallaCredentials = await settingModel.find({
    settingID: settingID,
  });

  const result = sallaCredentials[0];
  const clientId = result.aliExpress.appID;
  const clientSecret = result.aliExpress.secretKey;
  const redirectUri =
    "http://localhost:4000/ali_express_account/callback/1865370236";

  // Step 3: Exchange the authorization code for an access token
  const tokenUrl = "https://accounts.salla.sa/oauth2/token";
  const tokenData = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "authorization_code",
    code: code,
    redirect_uri: redirectUri,
    scope: "offline_access",
  };

  res
    .status(200)
    .json(utils.getResponse(false, { tokenData, tokenUrl }, "data"));
});

app.get("/hello-word", async (req, res) => {
  res.status(200).json({ message: "Server running very good!" });
});

const getKey = (header, callback) => {
  jwksRsa({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri,
  }).getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
};

app.use((req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  jwt.verify(
    token,
    getKey,
    {
      audience,
      issuer: issuerBaseURL,
      algorithms: ["RS256"],
    },
    (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json(utils.getResponse(true, [], "Unauthorized"));
      }
      next();
    }
  );
});

// ali express authorize
app.get("/api/auth/aliexpress/authorize", async (req, res) => {
  const sallaCredentials = await settingModel.find({
    settingID: req.query.settingID,
  });
  const result = sallaCredentials[0];

  const clientId = result.aliExpress.appID;
  const redirectUri = "https://chrome-extension-frontend.vercel.app/dashboard";

  const authorizationUrl = "https://api-sg.aliexpress.com/oauth/authorize";
  const authorizationLink = `${authorizationUrl}?response_type=code&force_auth=true&redirect_uri=${redirectUri}&client_id=${clientId}`;

  // res.redirect(authorizationLink);
  res
    .status(200)
    .json(utils.getResponse(false, { link: authorizationLink }, "Auth Link"));
});

// salla account authorize
app.get("/api/auth/salla_account/authorize", async (req, res) => {
  const sallaCredentials = await settingModel.find({
    settingID: req.query.settingID,
  });

  const result = sallaCredentials[0];
  let clientId = result.sallaAccount.clientID;
  let clientSecret = result.sallaAccount.clientSecretKey;
  let redirectUri = "https://chrome-extension-frontend.vercel.app/settings";

  const authorizationUrl = "https://accounts.salla.sa/oauth2/auth";
  const scope = "offline_access";
  const state = "12345678";

  const authorizationLink = `${authorizationUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;

  res
    .status(200)
    .json(utils.getResponse(false, { link: authorizationLink }, "Auth Link"));
});

// login routes
app.post("/api/auth/login", async (req, res, next) => {
  try {
    if (req.body && req.body.userInfo) {
      const user = req.body.userInfo;
      const existingUser = await userModel.findOne({ sub: user.sub });

      if (existingUser) {
        res
          .status(200)
          .json(utils.getResponse(false, existingUser, "User already exists!"));
      } else {
        const userInfo = new userModel({ ...user });
        const result = await userInfo.save();

        if (result) {
          res
            .status(200)
            .json(
              utils.getResponse(false, result, "User data has been saved!")
            );
        } else {
          throw new Error("Error occurred while saving user data!");
        }
      }
    }
  } catch (ex) {
    next(ex);
  }
});

// get all setting
app.get("/api/setting/", async (req, res, next) => {
  try {
    const info = req.query;
    const result = await settingModel.find({ settingID: info.settingID });
    if (result) {
      res
        .status(200)
        .json(utils.getResponse(false, result, "Successfully get settings!"));
    } else {
      throw new Error("Error occurred while getting setting!");
    }
  } catch (ex) {
    next(ex);
  }
});

// save settings
app.post("/api/setting/save", async (req, res, next) => {
  try {
    const info = req.body;
    const existingSetting = await settingModel.findOne({
      settingID: info.settingID,
    });

    if (existingSetting) {
      // If a record exists, update it
      const result = await settingModel.findOneAndUpdate(
        { settingID: info.settingID },
        { $set: info },
        { new: true }
      );
      if (result) {
        res
          .status(200)
          .json(utils.getResponse(false, result, "Settings has been updated!"));
      } else {
        throw new Error("Error occurred while updating setting!");
      }
    } else {
      // If no record exists, create a new record
      const settingInfo = new settingModel({ ...info });
      const result = await settingInfo.save();
      if (result) {
        res
          .status(200)
          .json(utils.getResponse(false, result, "Settings has been saved!"));
      } else {
        throw new Error("Error occurred while saving setting!");
      }
    }
  } catch (ex) {
    next(ex);
  }
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server starting at ---> http://localhost:${port}`);
});
