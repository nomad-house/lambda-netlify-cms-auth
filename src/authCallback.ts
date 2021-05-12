import { verify } from "jsonwebtoken";
import { APIGatewayEvent, Context, Callback, APIGatewayProxyResult } from "aws-lambda";
import { fetchToken } from "./fetchToken";
import { renderSuccess, renderError } from "./render";

const secret = process.env.JWT_SECRET ?? "lousy-secret-yo";

export const handler = async (
  event: APIGatewayEvent,
  _: Context,
  callback: Callback<APIGatewayProxyResult>
) => {
  const headers = { "Content-Type": "text/html; charset=utf-8" };
  const queryParams = event.queryStringParameters ?? {};
  const code = queryParams["code"];
  const state = queryParams["state"] as string;
  const origin = `${process.env.ORIGIN}`;
  try {
    if (!code) {
      return callback(null, {
        statusCode: 400,
        headers,
        body: renderError(origin, "Code parameter missing"),
      });
    }

    verify(state, secret, (error, _) => {
      if (error) {
        return callback(null, {
          statusCode: 400,
          headers,
          body: renderError(origin, "Invalid state parameter"),
        });
      }
    });

    const tokenResponse = await fetchToken(code);
    const { access_token, error } = tokenResponse;

    if (error) {
      return callback(null, {
        statusCode: 400,
        headers,
        body: renderError(origin, error),
      });
    }

    return callback(null, {
      statusCode: 200,
      headers,
      body: renderSuccess(origin, access_token),
    });
  } catch (err) {
    console.error(err);
    return callback(null, {
      statusCode: 500,
      headers,
      body: renderError(origin, JSON.stringify(err)),
    });
  }
};
