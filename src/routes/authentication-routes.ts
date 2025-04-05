import { Hono } from "hono";
import {
  logInWithUsernameAndPassword,
  signUpWithUsernameAndPassword,
} from "../controllers/authentication/authentication-controller.js";
import {
  signInWithUsernameAndPasswordError,
  signUpWithUsernameAndPasswordError,
} from "../controllers/authentication/authentication-types.js";

export const authenticationRoutes = new Hono();

authenticationRoutes.post("/sign-up", async (context) => {
  const { username, password } = await context.req.json();

  try {
    const result = await signUpWithUsernameAndPassword({ username, password });

    return context.json({ data: result }, 201);
  } catch (e) {
    console.error("❌ Sign-up error:", e); // Log the actual error

    if (e === signUpWithUsernameAndPasswordError.CONFLICTING_USERNAME) {
      return context.json({ message: "Username already exists" }, 409);
    }

    return context.json({ message: `Unknown: ${e}` }, 500); // Include error in response
  }
});


authenticationRoutes.post("/log-in", async (context) => {
  try {
    const { username, password } = await context.req.json();

    const result = await logInWithUsernameAndPassword({
      username,
      password,
    });

    return context.json(
      {
        data: result,
      },
      201
    );
  } catch (e) {
    console.log("Error", e);

    if (
      e === signInWithUsernameAndPasswordError.INVALID_CREDENTIALS ||
      e === signInWithUsernameAndPasswordError.UNKNOWN_ERROR
    ) {
      return context.json(
        {
          message: "Incorrect username or password",
        },
        401
      );
    }

    return context.json(
      {
        message: "Unknown",
      },
      500
    );
  }
});
