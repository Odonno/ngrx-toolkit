import lensPath from 'ramda/src/lensPath';
import view from 'ramda/src/view';
import set from 'ramda/src/set';

export const createCollectionReducer = <TState, TEntity, TEntityKey>(
    collectionSelector: (state: TState) => TEntity[],
    keySelector: (entity: TEntity) => TEntityKey,
    updateStateFunction: (state: TState, updatedCollection: TEntity[]) => TState
) => {
    const upsertOne = (state: TState, newEntity: TEntity) => {
        const collection = collectionSelector(state);
        const newEntities = [newEntity].filter(e => collection.every(c => keySelector(c) !== keySelector(e)));

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
    const upsertMany = (state: TState, entities: TEntity[]) => {
        const collection = collectionSelector(state);
        const newEntities = entities.filter(e => collection.every(c => keySelector(c) !== keySelector(e)));

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

export const createFeatureCollectionReducer = <TState, TEntity, TEntityKey>(
    featureName: string,
    keySelector: (entity: TEntity) => TEntityKey
) => {
    const lensPathFunction = lensPath(featureName.split('.'));

    return createCollectionReducer<TState, TEntity, TEntityKey>(
        state => view(lensPathFunction, state),
        keySelector,
        (state, entities) => set(lensPathFunction, entities, state)
    )
};