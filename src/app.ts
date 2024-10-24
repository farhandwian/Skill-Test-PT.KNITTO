import "make-promises-safe";
import "./config/aliases";

import { DatabaseClient } from "@infra/database/orm";
import WebAppFactory from "@infra/web/web-app.factory";
import HttpServer from "@infra/web/server";

class App {
  public static async main(): Promise<void> {
    console.log("tes1");

    const databaseClient = DatabaseClient.getInstance();
    console.log("tes2");

    await databaseClient.connect();
    console.log("tes3");

    const webAppFactory = new WebAppFactory();
    console.log("tes4");
    const expressApp = webAppFactory.getExpressApp();

    const server = new HttpServer(expressApp.build());

    server.configure();

    server.listen(process.env.PORT || 3000);
  }
}

App.main().catch(console.error);
