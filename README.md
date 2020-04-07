# Ngrx Toolkit

A set of functions and tools to simplify the development of an @ngrx app

### Collection reducer

Collection reducer is kinda like a lightweight version of @ngrx/entity. The main difference is that it is transparent to your own state. You store collection of entities in your state (see example below) and you will be able to use different reducers functions: 

* `upsertOne` - add a new entity or update only some properties of an entity
* `upsertMany` - add a new entities and/or update only some properties of existing entities
* `replaceOne` - add a new entity or replace an existing entity
* `replaceOne` - add new entities and/or replace existing entities
* `removeOne` - remove an existing entity (if possible)
* `removeMany` - remove multiple entities (if possible)
* `removeAll` - clean the collection by removing all entities

#### createCollectionReducer

Create a new collection reducer based on the given state.
Each entity should have a unique key identifier.

Given the following state:

```ts
type Character = {
  id: number;
  name: string;
}

type State = {
  characters: Character[];
}
```

You can create a new collection reducer like that:

```ts
const collectionReducer = createCollectionReducer(
    (state: State) => state.characters,
    character => character.id,
    (state, newCollection) => ({
        ...state,
        characters: newCollection
    })
);

const newState = collectionReducer.replaceOne(initialState, character);
```

#### createFeatureCollectionReducer

`createFeatureCollectionReducer` simplifies the creation of a collection reducer using feature name.

```ts
const collectionReducer = createFeatureCollectionReducer<State, Character, number>(
    'characters',
    character => character.id
);

const newState = collectionReducer.replaceOne(initialState, character);
```