import lensPath from 'ramda/src/lensPath';
import view from 'ramda/src/view';
import set from 'ramda/src/set';

/**
 * Create a reducer for a collection of entities that is stored in the state. 
 * The reducer will contains several functions to help you with collection management:
 * @exports upsertOne - add a new entity or update only some properties of an entity
 * @exports upsertMany - add a new entities and/or update only some properties of existing entities
 * @exports replaceOne - add a new entity or replace an existing entity
 * @exports replaceOne - add new entities and/or replace existing entities
 * @exports removeOne - remove an existing entity (if possible)
 * @exports removeMany - remove multiple entities (if possible)
 * @exports removeAll - clean the collection by removing all entities
 * @param collectionSelector Selector function used to access the collection in the state.
 * @param keySelector Selector used to get the main identifier of an entity in the collection.
 * @param updateStateFunction Function used to update the state.
 * 
 * @example
 *  const collectionReducer = createCollectionReducer(
      (state: State) => state.characters,
      character => character.id,
      (state, newCollection) => ({
        ...state,
        characters: newCollection
      })
    );
    const newState = collectionReducer.replaceOne(initialState, character);
 */
export const createCollectionReducer = <TState, TEntity, TEntityKey>(
    collectionSelector: (state: TState) => TEntity[],
    keySelector: (entity: Partial<TEntity>) => TEntityKey,
    updateStateFunction: (state: TState, updatedCollection: TEntity[]) => TState
) => {
    const upsertOne = (state: TState, newEntity: Partial<TEntity>) => {
        const collection = collectionSelector(state);
        const newEntities = [newEntity].filter(e => collection.every(c => keySelector(c) !== keySelector(e))) as TEntity[];
        
        return updateStateFunction(
            state,
            collection
                .map(existingEntity => {
                    if (keySelector(existingEntity) === keySelector(newEntity)) {
                        return {
                            ...existingEntity,
                            newEntity
                        };
                    }
                    return existingEntity;
                })
                .concat(newEntities)
        );
    };
    const upsertMany = (state: TState, entities: Partial<TEntity>[]) => {
        const collection = collectionSelector(state);
        const newEntities = entities.filter(e => collection.every(c => keySelector(c) !== keySelector(e))) as TEntity[];

        return updateStateFunction(
            state,
            collection
                .map(existingEntity => {
                    const newEntity = newEntities.find(e => keySelector(e) === keySelector(existingEntity));

                    if (newEntity) {
                        return {
                            ...existingEntity,
                            newEntity
                        };
                    }
                    return existingEntity;
                })
                .concat(newEntities)
        );
    };
    const replaceOne = (state: TState, entity: TEntity) => {
        return updateStateFunction(
            state,
            collectionSelector(state)
                .filter(e => keySelector(e) !== keySelector(entity))
                .concat(entity)
        );
    };
    const replaceMany = (state: TState, entities: TEntity[]) => {
        const keys = entities.map(keySelector);

        return updateStateFunction(
            state,
            collectionSelector(state)
                .filter(e => keys.every(key => key !== keySelector(e)))
                .concat(entities)
        );
    };
    const removeOne = (state: TState, key: TEntityKey) => {
        return updateStateFunction(
            state,
            collectionSelector(state)
                .filter(e => keySelector(e) !== key)
        );
    };
    const removeMany = (state: TState, keys: TEntityKey[]) => {
        return updateStateFunction(
            state,
            collectionSelector(state)
                .filter(e => keys.every(key => key !== keySelector(e)))
        );
    };
    const removeAll = (state: TState) => {
        return updateStateFunction(
            state,
            []
        );
    };

    return {
        upsertOne,
        upsertMany,
        replaceOne,
        replaceMany,
        removeOne,
        removeMany,
        removeAll
    };
};

/**
 * Create a collection reducer based on a feature name.
 * @param featureName Name of the feature (path to the property).
 * @param keySelector Selector used to get the main identifier of an entity in the collection.
 * 
 * @example
 *  const collectionReducer = createFeatureCollectionReducer<State, Character, number>(
      'characters',
      character => character.id
    );
    const newState = collectionReducer.replaceOne(initialState, character);
 * @example
 *  const collectionReducer = createFeatureCollectionReducer<State, Character, number>(
      'nested.characters',
      character => character.id
    );
    const newState = collectionReducer.replaceOne(initialState, character);
 */
export const createFeatureCollectionReducer = <TState, TEntity, TEntityKey>(
    featureName: string,
    keySelector: (entity: TEntity) => TEntityKey
) => {
    const lensPathFunction = lensPath(featureName.split('.'));

    return createCollectionReducer<TState, TEntity, TEntityKey>(
        state => view(lensPathFunction, state),
        keySelector,
        (state, entities) => set(lensPathFunction, entities, state)
    );
};