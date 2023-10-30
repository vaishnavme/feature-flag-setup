let env = "dev";
const fs = require("fs");
const featureFlags = require("../featureFlags.json");

Object.defineProperty(String.prototype, "capitalize", {
  value() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false,
});

if (process.env.NEXT_PUBLIC_ENV) {
  env = process.env.NEXT_PUBLIC_ENV;
}

const envFeatureFlags = featureFlags[env];
if (!envFeatureFlags) {
  console.error("Invalid feature flags config or invalid env", env);
  process.exit(-1);
}
let functions = "";

Object.keys(envFeatureFlags).forEach((feature) => {
  console.log("Adding feature function", feature);
  functions += `is${feature.capitalize()}Enabled: () => {
		return ${envFeatureFlags[feature]};
	},`;
});

// Got feature flags and generating the file
const template = `
/**
* This is dynamically generated using npm run features!
* This is generated everytime based on featureFlags.json on the root path.
*/

const features = {
	${functions}
}

export default features;`;

fs.writeFileSync("lib/features.js", template, (err) => {
  console.log(err);
  process.exit(-2);
});
