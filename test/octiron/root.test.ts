import type { OctironStore } from "../../lib/types/store.ts";
import { assertArrayIncludes } from "@std/assert/array-includes";
import m from 'mithril';
import { assert } from "node:console";
import { rootFactory } from "../../lib/factories/rootFactory.ts";
import { selectionFactory } from "../../lib/factories/selectionFactory.ts";
import { makeStore } from "../../lib/store.ts";
import { mocks, todosRootIRI } from "../mocks.ts";
import type { IRIObject, JSONObject } from "../../lib/types/common.ts";


Deno.test('o.root()', async (t) => {
    // deno-lint-ignore no-explicit-any
    let currentResponse: Promise<any>;

    const users = [
        mocks.createUser(),
        mocks.createUser(),
        mocks.createUser(),
        mocks.createUser(),
    ] as const;
    const todos = [
        mocks.createTodo({
            assignee: users[0]['@id'],
        }),
        mocks.createTodo({
            assignee: users[1]['@id'],
        }),
        mocks.createTodo({
            assignee: users[2]['@id'],
        }),
        mocks.createTodo({
            assignee: users[3]['@id'],
        }),
    ] as const;
    const responses = [
        mocks.createAPIRoot(),
        mocks.createUserListing({ users: users as unknown as JSONObject[] }),
        mocks.createTodoListing({ todos: todos as unknown as JSONObject[] }),
        ...users,
        ...todos,
    ] as IRIObject[];
    const api = mocks.makeAPI(responses);

    const [fetcher, fetcherHook] = mocks.makeFetcherHook({
        api,
    });

    const entities: OctironStore['entities'] = {};
    const store = makeStore({
        vocab: mocks.todosVocab,
        aliases: {
            scm: mocks.scmVocab,
        },
        fetcher,
        entities,
        rootIRI: todosRootIRI,
        responseHook: (res) => currentResponse = res,
    });
    const root = rootFactory({
        store,
        typeDefs: {},
    });
    const select = selectionFactory({
        store,
        typeDefs: {},
    });

    function reset() {
        for (const key of Object.keys(entities)) {
            delete entities[key];
        }
    }

    await t.step('It fetches the root entity from a root instance', async () => {
        const fetchedIRIs: string[] = [];
        fetcherHook((iri) => fetchedIRIs.push(iri));
        reset();

        m.mount(
            mocks.makeDom(),
            mocks.component(root.root()),
        );

        await currentResponse;
        
        assertArrayIncludes(fetchedIRIs, [todosRootIRI]);
        assert(fetchedIRIs.length === 1);
    });

    await t.step('It a deep selection from a root instance', async () => {
        const fetchedIRIs: string[] = [];
        fetcherHook((iri) => fetchedIRIs.push(iri));
        reset();

        const dom = mocks.makeDom();

        m.mount(
            dom,
            mocks.component(root.root('todoListing members username')),
        );

        await currentResponse;
        
        console.log(dom?.innerHTML);

        assertArrayIncludes(fetchedIRIs, [todosRootIRI]);
        assert(fetchedIRIs.length === 1);
    });

    await t.step('It fetches the root entity from a select instance', async () => {
        const fetchedIRIs: string[] = [];
        fetcherHook((iri) => fetchedIRIs.push(iri));
        reset();

        m.mount(
            mocks.makeDom(),
            mocks.component(select.root()),
        );

        await currentResponse;
        
        assertArrayIncludes(fetchedIRIs, [todosRootIRI]);
        assert(fetchedIRIs.length === 1);
    });

    await t.step('It only fetches on first fetch', async () => {
        const fetchedIRIs: string[] = [];
        fetcherHook((iri) => fetchedIRIs.push(iri));
        reset();

        m.mount(
            mocks.makeDom(),
            mocks.component(root.root()),
        );

        await currentResponse;
        
        m.mount(
            mocks.makeDom(),
            mocks.component(root.root()),
        );

        await currentResponse;
        
        assertArrayIncludes(fetchedIRIs, [todosRootIRI]);
        assert(fetchedIRIs.length === 1);
    });
});