export const createCollectionReducer = <TState, TEntity, TEntityKey>(
    collectionSelector: (state: TState) => TEntity[],
    keySelector: (entity: TEntity) => TEntityKey,
    updateStateFunction: (state: TState, updatedCollection: TEntity[]) => TState // TODO : can we do the same without it?
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
) => createCollectionReducer<TState, TEntity, TEntityKey>(
    state => state[featureName], // TODO : use lens to get state property (if using dot notation)
    keySelector,
    (state, entities) => ({
        ...state,
        [featureName]: entities
    })
);