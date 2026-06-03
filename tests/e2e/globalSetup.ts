import { resetDB } from "./helpers/reset";

async function globalSetup() {
  await resetDB();
}

export default globalSetup;
