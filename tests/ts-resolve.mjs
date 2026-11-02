// Les sources Angular importent sans extension (`./policy.model`) ; Node exige
// `.ts`. Ce hook retente l'import relatif avec `.ts` quand le fichier nu manque.
// Usage : node --import ./tests/ts-resolve.mjs --test tests/search-v2/
import { registerHooks } from 'node:module';

registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (err) {
      if (err?.code === 'ERR_MODULE_NOT_FOUND' && specifier.startsWith('.') && !specifier.endsWith('.ts')) {
        return nextResolve(`${specifier}.ts`, context);
      }
      throw err;
    }
  },
});
