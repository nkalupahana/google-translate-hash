import { hash, verify } from "./index.js";

(async () => {
   const passHash = await hash("correct home battery staple", 5);
   console.log(passHash);
   console.log(await verify("correct home battery staple", passHash));
   console.log(await verify("correct house battery staple", passHash));
})();