
import type { Store } from "../store.ts";
import type { JSONObject, SCMPropertyValueSpecification } from '../types/common.ts';
import type { Spec } from '../types/octiron.ts';

const httpRe = /^https?\:\/\//;
const scmCtxRe = /^https?\:\/\/schema\.org/;
const scmTypeRe = /^https?\:\/\/schema\.org\/(?<term>(readonlyValue|valueName|valueRequired|defaultValue|minValue|maxValue|stepValue|valuePattern|multipleValues|valueMinLength|valueMaxLength))/;

export function resolvePropertyValueSpecification({
  spec,
  store,
}: {
  spec: JSONObject;
  store: Store;
}): Spec {
  const pvs: SCMPropertyValueSpecification = {
    readonlyValue: false,
    valueRequired: false,
  };

  let scmAlias: [string, string] | undefined;
  const scmVocab = store.vocab == null ? false : scmCtxRe.test(store.vocab);

  for (const [key, value] of Object.entries(store.aliases)) {
    if (scmCtxRe.test(value)) {
      scmAlias = [key, value];

      break;
    }
  }

  for (const [term, value] of Object.entries(spec)) {
    let type;

    if (!httpRe.test(term)) {
      if (scmVocab && !term.includes(':')) {
        type = `${store.vocab}${term}`;
      } else if (scmAlias && term.startsWith(`${scmAlias[0]}:`)) {
        type = term.replace(`${scmAlias[0]}:`, scmAlias[1]);
      }
    } else {
      type = term;
    }

    if (!type) {
      continue;
    }

    const result = scmTypeRe.exec(type);

    if (result?.groups?.term) {
      (pvs as JSONObject)[result.groups.term] = value;
    }
  }

  return {
    readonly: pvs.readonlyValue,
    required: pvs.valueRequired,
    name: pvs.valueName,
    min: pvs.minValue,
    max: pvs.maxValue,
    step: pvs.stepValue,
    pattern: pvs.valuePattern,
    multiple: pvs.multipleValues,
    minLength: pvs.valueMinLength,
    maxLength: pvs.valueMaxLength,
  };
}
