import cors from "cors";
import dotenv from "dotenv";
import express, { Application, NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import jwksRsa from "jwks-rsa";
import { errorHandler } from "./src/middlewares/errorHandler";
import settingModel from "./src/models/settingModel";
import mainRoutes from "./src/routes/mainRoutes";
import { setupDB } from "./src/services/database";
import utils from "./src/utils/utils";
dotenv.config();

const app: Application = express();
const port = process.env.PORT;

const jwksUri = "https://samirqureshi.us.auth0.com/.well-known/jwks.json";
const audience = "this is identifier";
const issuerBaseURL = "https://samirqureshi.us.auth0.com/";

setupDB().catch((error: any) => {
  console.error("Failed to set up MongoDB:", error.message);
  process.exit(1);
});

// Middleware
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cors());

// salla callback authentication
// please set the callback url in  salla app  (http://localhost:4000/salla_account/callback/1865370236)
app.get("/salla_account/callback/1865370236", async (req, res) => {
  const { code } = req.query;
  const sallaCredentials = await settingModel.find({
    settingID: req.query.settingID,
  });
  const result = sallaCredentials[0];

  const clientId = result.sallaAccount.clientID;
  const clientSecret = result.sallaAccount.clientSecretKey;
  const redirectUri = "http://localhost:4000/salla_account/callback/1865370236";

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

// ali express callback authentication
// please set the callback url in  ali express app  (http://localhost:4000/ali_express_account/callback/1865370236)
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

const getKey = (header: any, callback: any) => {
  jwksRsa({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri,
  }).getSigningKey(header.kid, (err, key: any) => {
    if (err) {
      return callback(err);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
};

app.use((req: Request, res: Response, next: NextFunction) => {
  const token: any = req.headers.authorization?.split(" ")[1];

  jwt.verify(
    token,
    getKey,
    {
      audience,
      issuer: issuerBaseURL,
      algorithms: ["RS256"],
    },
    (err: any, decoded: any) => {
      if (err) {
        return res
          .status(401)
          .json(utils.getResponse(true, [], "Unauthorized"));
      }
      next();
    }
  );
});

app.use("/api", mainRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server starting at ---> http://localhost:${port}`);
});
