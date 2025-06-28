import type { Children } from "mithril";
import type { Aliases, Fetcher, FetcherArgs } from "../lib/store.ts";
import type { OctironStore } from "../lib/types/store.ts";
import type { IRIObject, JSONObject } from "../lib/types/common.ts";
import { flattenIRIObjects } from "../lib/utils/flattenIRIObjects.ts";
import jsonld from 'jsonld';
import { DOMParser } from '@b-fuze/deno-dom';
import { faker } from '@faker-js/faker';

export type TodoStatus =
  | "todo"
  | "in-progress"
  | "done";

export const todosRootIRI = 'http://example.com/api';
export const todosVocab = 'https://todos.example.com/';
export const scmVocab = 'https://schema.org/';

export enum TodoTypes {
  Listing = "https://todos.example.com/Listing",
  members = "https://todos.example.com/members",

  APIRoot = "https://todos.example.com/Todo",
  Todo = "https://todos.example.com/Todo",
  TodoListing = "https://todos.example.com/TodoListing",
  todoListing = "https://todos.example.com/todoListing",
  todo = "https://todos.example.com/todo",
  todos = "https://todos.example.com/todos",
  title = "https://schema.org/name", // correct use of schema.org/name I believe
  description = "https://schema.org/description",
  status = "https://todos.example.com/status",
  assignee = "https://todos.example.com/assignee",
  subtodos = "https://todos.example.com/subtodos",

  User = "https://todos.example.com/User",
  UserListing = "https://todos.example.com/UserListing",
  userListing = "https://todos.example.com/userListing",
  user = "https://todos.example.com/user",
  users = "https://todos.example.com/users",
  username = "https://todos.example.com/username",
  email = "https://todos.example.com/email",
}

const used: string[] = [];
function makeUniqueId() {
  let uniqueId: string;

  do {
    uniqueId = Math.random().toString(16).split(".")[1];
    used.push(uniqueId);
  } while (!used.includes(uniqueId));

  return uniqueId;
}

function makeIRI(type: string) {
  return `${todosRootIRI}/api/${type}`;
}

function makeDetailIRI(type: string) {
  return `${makeIRI(type)}/${makeUniqueId()}`;
}

function createAPIRoot() {
  return {
    "@id": todosRootIRI,
    "@type": TodoTypes.APIRoot,
    [TodoTypes.userListing]: {
      "@id": makeIRI('users'),
      "@type": TodoTypes.UserListing,
    },
    [TodoTypes.todoListing]: {
      "@id": makeIRI('todos'),
      "@type": TodoTypes.TodoListing,
    },
  };
}

function createUser({
  username = faker.internet.username(),
  email = faker.internet.email(),
}: {
  username?: string;
  email?: string;
} = {}) {
  return {
    "@id": makeDetailIRI("users"),
    "@type": TodoTypes.User,
    [TodoTypes.username]: username,
    [TodoTypes.email]: email,
  } as const;
}

export type MockUser = ReturnType<typeof createUser>;

function createUserListing<
  const T extends JSONObject,
>({
  users,
}: {
  users: Array<T>;
}) {
  return {
    "@id": makeIRI("users"),
    "@type": [TodoTypes.UserListing, TodoTypes.Listing],
    [TodoTypes.members]: users,
  } as const;
}

function createEpic<
  const T extends JSONObject,
>({
  title = faker.word.words(3),
  description = faker.lorem.sentences(),
  status = faker.helpers.arrayElement<TodoStatus>(['todo', 'in-progress', 'done']),
  assignee,
  subtodos,
}: {
  title?: string;
  description?: string;
  status?: TodoStatus;
  assignee: string;
  subtodos: T[];
}) {
  return {
    "@id": makeDetailIRI("todos"),
    "@type": TodoTypes.Todo,
    [TodoTypes.title]: title,
    [TodoTypes.description]: description,
    [TodoTypes.status]: status,
    [TodoTypes.assignee]: { "@id": assignee },
    [TodoTypes.subtodos]: subtodos,
  } as const;
}

function createTodo({
  title = faker.word.words(3),
  description = faker.lorem.sentences(),
  status = faker.helpers.arrayElement<TodoStatus>(['todo', 'in-progress', 'done']),
  assignee,
}: {
  title?: string;
  description?: string;
  status?: TodoStatus;
  assignee: string;
}) {
  return {
    "@id": makeDetailIRI("todos"),
    "@type": TodoTypes.Todo,
    [TodoTypes.title]: title,
    [TodoTypes.description]: description,
    [TodoTypes.status]: status,
    [TodoTypes.assignee]: { "@id": assignee },
  } as const;
}

export type MockTodo = ReturnType<typeof createTodo>;

function createTodoListing<
  const T,
>({
  todos,
}: {
  todos: Array<T>;
}) {
  return {
    "@id": makeIRI("todos"),
    "@type": [TodoTypes.TodoListing, TodoTypes.Listing],
    [TodoTypes.members]: todos,
  } as const;
}

/**
 * Transforms one or many entities into entity state
 * objects. The given entities should be in their
 * expanded form. The first argument provides JSON-LD
 * context values if required.
 * 
 * @param args.vocab - The JSON-LD `@vocab` value
 * @param args.aliases - Object of alias: vocab mappings for the
 *                       JSON-LD context
 * @param {...*} entities - Entities to transform into entity state.
 */
async function toEntityState({
  vocab,
  aliases = {},
}: {
  vocab?: string;
  aliases?: Aliases;
}, ...entities: JSONObject[]): Promise<OctironStore['entities']> {
  let ctx: JSONObject = aliases;

  if (vocab != null) {
    ctx['@vocab'] = vocab;
  }

  const compacted = await Promise.all(
    entities.map((entity) => {
      // deno-lint-ignore no-explicit-any
      return jsonld.compact(entity, ctx as any);
    }),
  ) as Array<IRIObject>;

  const result: OctironStore['entities'] = {};
  
  for (const entity of flattenIRIObjects(compacted)) {
    result[entity["@id"]] = {
      iri: entity["@id"],
      ok: true,
      loading: false,
      value: entity,
      contentType: 'application/ld+json',
    };
  }

  return result;
}

function createEntityState(url: string, value: IRIObject): OctironStore['entities'] {
  return {
    [url]: {
      iri: value['@id'],
      ok: true,
      loading: false,
      value,
      contentType: 'application/ld+json',
    },
  };
}

export type MockAPI = Record<string, IRIObject>

function makeAPI(responses: IRIObject[]): MockAPI {
  return responses.reduce((acc, entity) => {
    return {
      ...acc,
      [entity['@id']]: entity,
    };
  }, {});
}

export type Listener = (
  iri: string,
  args: FetcherArgs,
) => void;
export type ListenHook = (listener: Listener) => void;

function makeFetcherHook({
  api,
}: {
  api?: MockAPI
} = {}): [Fetcher, ListenHook] {
  let runner: Listener | undefined;

  const fetcher: Fetcher = (iri, args) => {
    if (typeof runner === 'function') {
      runner(iri, args);
    }

    if (api != null) {
      const result = api[iri];

      if (result != null) {
        const res = new Response(JSON.stringify(result), {
          status: 200,
          headers: {
            'content-type': 'application/ld+json',
          },
        });
        
        return Promise.resolve(res);
      }
    }

    return fetch(iri, args);
  }

  const fetcherHook: ListenHook = (listener) => {
    runner = listener;
  }

  return [fetcher, fetcherHook];
}

function makeDom() {
  const dom = new DOMParser().parseFromString(`<div id="app"></div>`, "text/html");

  return dom.getElementById('app');
}

function delay(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function component(children: Children) {
  return {
    view: () => {
      return children;
    },
  };
}

export const mocks = {
  todosRootIRI,
  todosVocab,
  scmVocab,
  createAPIRoot,
  createEpic,
  createTodo,
  createUser,
  createUserListing,
  createTodoListing,
  toEntityState,
  createEntityState,
  makeAPI,
  makeFetcherHook,
  makeDom,
  delay,
  component,
} as const;
