import { Client, Account, Databases } from "appwrite";

const client = new Client()
    .setEndpoint("https://fra.cloud.appwrite.io/v1")
    .setProject("6999bfe9000948ab64cc");

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };
