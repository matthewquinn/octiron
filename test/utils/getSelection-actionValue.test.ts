import { assert, assertEquals } from "@std/assert";
import { Store } from "../../lib/store.ts";
import { getSelection } from "../../lib/utils/getSelection.ts";
import * as mocks from "../mocks.ts";
import { escapeJSONPointerParts } from "../../lib/utils/escapeJSONPointerParts.ts";
import { ActionSelectionDetails, ActionSelectionResult } from "../../lib/types/store.ts";
import { JSONObject } from "@octiron/octiron";
import { resolvePropertyValueSpecification } from "../../lib/utils/resolvePropertyValueSpecification.ts";


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

Deno.test("getSelection(actionValue)", async (t) => {
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

  await t.step('Selects deep payload values', () => {
    const actionValue = mocks.createTodoAction();
    const value = {
      [mocks.TodoTypes.steps]: [
        {
          [mocks.TodoTypes.text]: 'Text 1',
        },
        {
          [mocks.TodoTypes.text]: { '@value': 'Text 2' },
        },
      ],
    };

    const selectionDetails1 = getSelection<ActionSelectionResult>({
      selector: 'steps text',
      value,
      actionValue,
      store,
    });

    const selectionDetails2 = getSelection<ActionSelectionResult>({
      selector: 'text',
      value: value['https://todos.example.com/steps'][0],
      actionValue: actionValue['https://todos.example.com/steps'],
      store,
    });

    const spec = resolvePropertyValueSpecification({
      store,
      spec: actionValue['https://todos.example.com/steps']['https://todos.example.com/text-input'],
    });

    assert(selectionDetails1.result[0].value === 'Text 1');
    assert(selectionDetails1.result[0].pointer === `/${escapeJSONPointerParts(mocks.TodoTypes.steps, '0', mocks.TodoTypes.text)}`);
    assertEquals(selectionDetails1.result[0].spec as JSONObject, spec)

    assert(selectionDetails1.result[1].value === 'Text 2');
    assert(selectionDetails1.result[1].pointer === `/${escapeJSONPointerParts(mocks.TodoTypes.steps, '1', mocks.TodoTypes.text)}`);
    assertEquals(selectionDetails1.result[1].spec as JSONObject, spec)

    assert(selectionDetails2.result[0].value === 'Text 1');
    assert(selectionDetails2.result[0].pointer === `/${escapeJSONPointerParts(mocks.TodoTypes.text)}`);
    assertEquals(selectionDetails2.result[0].spec as JSONObject, spec)
  });
});
