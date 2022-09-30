const { demoProjectId, env, runOrExit } = require("./common")

runOrExit("yarn", ["workspace", "@maple-testimony/functions", "build-all"], {
  stdio: "inherit"
})

runOrExit(
  "yarn",
  [
    "g:firebase",
    "--project",
    demoProjectId,
    "emulators:exec",
    "--only",
    "auth,functions,pubsub,firestore,storage",
    "--import",
    "tests/integration/exportedTestData",
    "yarn test:integration --forceExit tests/integration/search.test.ts"
  ],
  { stdio: "inherit", env }
)
