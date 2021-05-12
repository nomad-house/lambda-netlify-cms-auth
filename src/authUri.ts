import { URLSearchParams } from "url";
import { sign } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { APIGatewayEvent, Context, Callback, APIGatewayProxyResult } from "aws-lambda";

export const handler = (
  _: APIGatewayEvent,
  __: Context,
  callback: Callback<APIGatewayProxyResult>
) => {
  try {
    const secret = process.env.JWT_SECRET ?? "lousy-secret-yo";
    const params = {
      client_id: process.env.GITHUB_CLIENT_ID,
      scope: "repo,user",
      state: sign({ nonce: uuidv4() }, secret, { expiresIn: 30 }),
    };

    callback(null, {
      body: "",
      statusCode: 307,
      headers: {
        Location: `https://github.com/login/oauth/authorize?${new URLSearchParams(params)}`,
      },
    });
  } catch (err) {
    callback(err);
  }
};
