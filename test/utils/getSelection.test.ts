import assert from "node:assert";
import * as mocks from "../mocks.ts";
import { getSelection, CircularSelectionError } from "../../lib/utils/getSelection.ts";
import { isJSONObject } from "../../lib/utils/isJSONObject.ts";
import { Store } from "../../lib/store.ts";

const user1 = mocks.createUser({
  username: "jane",
  email: "jane@example.com",
});
const user2 = mocks.createUser({
  username: "harvey",
  email: "harvey@example.com",
});
const user3 = mocks.createUser({
  username: "teddy",
  email: "teddy@example.com",
});

const epic2 = mocks.createEpic({
  title: "Epic 1",
  assignee: user1["@id"],
  subtodos: [
    mocks.createTodo({
      title: "Todo 1",
      assignee: user1["@id"],
    }),
    mocks.createTodo({
      title: "Todo 2",
      assignee: user2["@id"],
    }),
    mocks.createTodo({
      title: "Todo 3",
      assignee: user3["@id"],
    }),
    mocks.createTodo({
      title: "Todo 44",
      assignee: user1["@id"],
    }),
  ],
});

Deno.test("getSelection()", async (t) => {
  const ctx = {
    vocab: mocks.todosVocab,
    aliases: {
      scm: mocks.scmVocab,
    },
  };
  const primary = await mocks.toEntityState(ctx, user1, user2, user3, epic2);
  const store = new Store({
    rootIRI: mocks.todosRootIRI,
    primary,
    vocab: mocks.todosVocab,
    aliases: {
      scm: mocks.scmVocab,
    },
    handlers: [],
  });

  await t.step("Selects values in a deep object", () => {
    const selection = getSelection({
      store,
      selector: "foo baa baz",
      value: {
        [`${mocks.todosVocab}foo`]: [
          {
            [`${mocks.todosVocab}baa`]: {
              [`${mocks.todosVocab}baz`]: 123,
            },
          },
          {
            "@value": {
              [`${mocks.todosVocab}baa`]: {
                [`${mocks.todosVocab}baz`]: 456,
              },
            },
          },
        ],
      },
    });

    assert.equal(selection.result[0].value, 123);
    assert.equal(selection.result[1].value, 456);
    assert.equal(selection.result.length, 2);
    assert.equal(selection.required.length, 0);
    assert.equal(selection.dependencies.length, 0);
  });

  await t.step("Selects an entity", () => {
    const iri = epic2["https://todos.example.com/subtodos"][0]["@id"];
    const selection = getSelection({
      store,
      selector: iri as string,
      value: undefined,
    });

    assert(/^http/.test(iri));
    assert.equal(
      selection.result[0].value,
      primary[iri as string].value,
    );
  });

  await t.step("Selects children of an entity in compact JSON-LD form", () => {
    const iri = epic2["@id"];
    const selection = getSelection({
      store,
      selector: `${iri} subtodos`,
    });

    assert(isJSONObject(selection.result[0].value));
    assert.deepEqual(
      selection.result[0].value["@id"],
      epic2["https://todos.example.com/subtodos"][0]["@id"],
    );
    assert.deepEqual(
      selection.result[0].value["https://schema.org/name"],
      epic2["https://todos.example.com/subtodos"][0]["https://schema.org/name"],
    );

    assert(isJSONObject(selection.result[1].value));
    assert.deepEqual(
      selection.result[1].value["@id"],
      epic2["https://todos.example.com/subtodos"][1]["@id"],
    );
    assert.deepEqual(
      selection.result[1].value["https://schema.org/name"],
      epic2["https://todos.example.com/subtodos"][1]["https://schema.org/name"],
    );
  });

  await t.step("Selects children of an entity in expanded JSON-LD form", async () => {
    const primary = await mocks.toEntityState({}, user1, user2, user3, epic2);
    const store = new Store({
      rootIRI: mocks.todosRootIRI,
      primary,
      handlers: [],
    });
    const iri = epic2["@id"];
    const selection = getSelection({
      store,
      selector: `${iri} ${mocks.TodoTypes.subtodos}`,
    });

    assert(isJSONObject(selection.result[0].value));
    assert.equal(
      selection.result[0].value["@id"],
      epic2["https://todos.example.com/subtodos"][0]["@id"],
    );
    assert.equal(
      selection.result[0].value["https://schema.org/name"],
      epic2["https://todos.example.com/subtodos"][0]["https://schema.org/name"],
    );

    assert(isJSONObject(selection.result[1].value));
    assert.equal(
      selection.result[1].value["@id"],
      epic2["https://todos.example.com/subtodos"][1]["@id"],
    );
    assert.equal(
      selection.result[1].value["https://schema.org/name"],
      epic2["https://todos.example.com/subtodos"][1]["https://schema.org/name"],
    );
  });

  await t.step("Selects a deep property of an entity", () => {
    const iri = epic2["@id"];
    const selection = getSelection({
      store,
      selector: `${iri} subtodos assignee username`,
    });

    assert(selection.result.length === 4);
    assert.equal(
      selection.result[0].value,
      user1['https://todos.example.com/username'],
    );

    assert.equal(
      selection.result[1].value,
      user2['https://todos.example.com/username'],
    );

    assert.equal(
      selection.result[2].value,
      user3['https://todos.example.com/username'],
    );

    assert.equal(
      selection.result[3].value,
      user1['https://todos.example.com/username'],
    );
  });

  await t.step('Catches cirular loops in selections', () => {
    const iri1 = `${mocks.todosRootIRI}/path/1`;
    const iri2 = `${mocks.todosRootIRI}/path/2`;
    const iri3 = `${mocks.todosRootIRI}/path/3`;

    // each of these objects only have iris pointing to the next
    // object. The `getSelection` will loop round following the
    // pointers until it finds an object containing concrete values.
    // In this case there are no concrete values and the references
    // are circular.
    const primary = {
      ...mocks.createEntityState(iri1, { '@id': iri2 }),
      ...mocks.createEntityState(iri2, { '@id': iri3 }),
      ...mocks.createEntityState(iri3, { '@id': iri1 }),
    };

    const store = new Store({
      rootIRI: mocks.todosRootIRI,
      primary,
      vocab: mocks.todosVocab,
      aliases: {
        scm: mocks.scmVocab,
      },
      handlers: [],
    });

    // will cause maximum call stack if fails
    try {
      getSelection({ store, selector: iri1 });
    } catch (err) {
      assert(err instanceof CircularSelectionError);
    }
  });
});
