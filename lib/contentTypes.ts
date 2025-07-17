import type { JSONObject } from "types/common";
import type { OctironStore } from "types/store";


export type HandlerOutputType =
  | 'jsonld'
  | 'problem-details'
  | 'html'
  | 'html-fragments'
;

export type JSONLDOutput = {
  value: JSONObject;
};

export type ProblemDetailsOutput = {
  value: JSONObject;
};

export type HTMLOutput = {
  id?: string;
  value?: string;
};

export type HTMLFragmentsOutput = {
  rootId?: string;
  root?: string;
  ided?: Record<string, string>;
  anon?: Record<string, string>;
};


export type ContentTypeHandler<T> = (
  res: Response,
  store: OctironStore,
) => Promise<T>;

export type HTMLOnDestroy = () => void;

export type HTMLOnCreate = (el: Element) => HTMLOnDestroy;

export type RegisterJSONLDHandlerArgs = {
  outputType: 'jsonld';
  contentType: string;
  handler: ContentTypeHandler<JSONLDOutput>;
};

export type RegisterProblemDetailsHandlerArgs = {
  outputType: 'problem-details',
  contentType: string;
  handler: ContentTypeHandler<ProblemDetailsOutput>
}

export type RegisterHTMLHandlerArgs = {
  outputType: 'html';
  contentType: string;
  handler: ContentTypeHandler<HTMLOutput>;
  onCreate?: HTMLOnCreate;
};

export type RegisterHTMLFragmentsHandlerArgs = {
  outputType: 'html-fragments';
  contentType: string;
  handler: ContentTypeHandler<HTMLFragmentsOutput>;
  onCreate: HTMLOnCreate;
};

export type RegisterHandlerArgs =
  | RegisterJSONLDHandlerArgs
  | RegisterProblemDetailsHandlerArgs
  | RegisterHTMLHandlerArgs
  | RegisterHTMLFragmentsHandlerArgs
;

export class ContentTypes {

  #handlers: Record<symbol, RegisterHandlerArgs>;

  constructor(args: RegisterHTMLHandlerArgs[]) {
    this.#handlers = args.reduce((acc, args) => {
      return {
        ...acc,
        [Symbol.for(args.contentType)]: args,
      }
    }, {});
  }

  public get(contentType: symbol): RegisterHandlerArgs | undefined {
    return this.#handlers[contentType];
  }

  public debug(): Record<string, RegisterHandlerArgs> {
    return Reflect.ownKeys(this.#handlers)
      .filter((key) => typeof key === 'symbol')
      .reduce(
      (acc, key: symbol) => ({ ...acc, [key.keyFor()]: this.#handlers[key] }),
      {},
    );
  }

}
