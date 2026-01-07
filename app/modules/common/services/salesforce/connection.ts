import jsforce from "jsforce";
import type { Connection } from "jsforce";
import dotenv from "dotenv";
dotenv.config();

export async function createSalesforceInstance(): Promise<
  Connection | undefined
> {
  const globalForSalesforceConn = globalThis as unknown as {
    salesforce?: Connection;
  };

  try {
    if (!globalForSalesforceConn.salesforce) {
      console.log("Salesforce Login Called");
      const username = process.env.SF_USER_EMAIL;
      const password = process.env.SF_USER_PASS;

      if (!username || !password) {
        throw new Error(
          "Salesforce credentials are not set in environment variables."
        );
      }

      const conn = new jsforce.Connection();
      await conn.login(username, password);

      globalForSalesforceConn.salesforce = conn;
    }

    if (!globalForSalesforceConn.salesforce) {
      throw new Error("Salesforce connection failed");
    }

    return globalForSalesforceConn.salesforce;
  } catch (error) {
    globalForSalesforceConn.salesforce = undefined;
    console.error("Salesforce login error:", error);
    throw error;
  }
}
