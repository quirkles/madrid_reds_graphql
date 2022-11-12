import { AppDataSource } from "../datasource";

async function main() {

}

main()
  .then(() => console.log("Seeded data"))
  .catch((err) => console.log(`Error seeding db: ${err.message}`));
