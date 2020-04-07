import { TestBed } from '@angular/core/testing';
import { createCollectionReducer, createFeatureCollectionReducer } from './collection-reducers';

type Character = {
  id: number;
  name: string;
  age: number;
}

type State = {
  characters: Character[];
  nested: {
    characters: Character[];
  };
}

describe('collection reducers', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  const initialState = {
    characters: [
      {
        id: 1,
        name: 'Luke Skywalker',
        age: 29
      },
      {
        id: 2,
        name: 'Anakin Skywalker',
        age: 23
      }
    ],
    nested: {
      characters: [
        {
          id: 1,
          name: 'Luke Skywalker',
          age: 29
        },
        {
          id: 2,
          name: 'Anakin Skywalker',
          age: 23
        }
      ]
    }
  };

  describe('createCollectionReducer', () => {
    const characterCollectionReducer = createCollectionReducer(
      (state: State) => state.characters,
      character => character.id,
      (state, newCollection) => ({
        ...state,
        characters: newCollection
      })
    );

    const nestedCharacterCollectionReducer = createCollectionReducer(
      (state: State) => state.nested.characters,
      character => character.id,
      (state, newCollection) => ({
        ...state,
        nested: {
          ...state.nested,
          characters: newCollection
        }
      })
    );

    describe('upsertOne', () => {
      describe('direct child state', () => {
        it('should update one entity if it already exist', () => {
          // arrange

          // act
          const characterUpdated = {
            id: 2,
            age: 25
          };

          const newState = characterCollectionReducer.upsertOne(initialState, characterUpdated);

          // assert
          expect(newState.characters.length).toBe(2);
          expect(newState.characters[0].name).toBe('Luke Skywalker');
          expect(newState.characters[0].age).toBe(29);
          expect(newState.characters[1].name).toBe('Anakin Skywalker');
          expect(newState.characters[1].age).toBe(23);
        });

        it('should add one entity if it does not exist', () => {
          // arrange

          // act
          const newCharacter = {
            id: 3,
            name: 'Han Solo',
            age: 31
          };

          const newState = characterCollectionReducer.upsertOne(initialState, newCharacter);

          // assert
          expect(newState.characters.length).toBe(3);
          expect(newState.characters[0].name).toBe('Luke Skywalker');
          expect(newState.characters[0].age).toBe(29);
          expect(newState.characters[1].name).toBe('Anakin Skywalker');
          expect(newState.characters[1].age).toBe(23);
          expect(newState.characters[2].name).toBe('Han Solo');
          expect(newState.characters[2].age).toBe(31);
        });
      });

      describe('nested child state', () => {
        it('should update one entity if it already exist', () => {
          // arrange

          // act
          const characterUpdated = {
            id: 2,
            age: 25
          };

          const newState = nestedCharacterCollectionReducer.upsertOne(initialState, characterUpdated);

          // assert
          expect(newState.nested.characters.length).toBe(2);
          expect(newState.nested.characters[0].name).toBe('Luke Skywalker');
          expect(newState.nested.characters[0].age).toBe(29);
          expect(newState.nested.characters[1].name).toBe('Anakin Skywalker');
          expect(newState.nested.characters[1].age).toBe(23);
        });

        it('should add one entity if it does not exist', () => {
          // arrange

          // act
          const newCharacter = {
            id: 3,
            name: 'Han Solo',
            age: 31
          };

          const newState = nestedCharacterCollectionReducer.upsertOne(initialState, newCharacter);

          // assert
          expect(newState.nested.characters.length).toBe(3);
          expect(newState.nested.characters[0].name).toBe('Luke Skywalker');
          expect(newState.nested.characters[0].age).toBe(29);
          expect(newState.nested.characters[1].name).toBe('Anakin Skywalker');
          expect(newState.nested.characters[1].age).toBe(23);
          expect(newState.nested.characters[2].name).toBe('Han Solo');
          expect(newState.nested.characters[2].age).toBe(31);
        });
      });
    });

    describe('replaceOne', () => {
      describe('direct child state', () => {
        it('should replace one entity if it already exist', () => {
          // arrange

          // act
          const characterUpdated = {
            id: 2,
            name: 'Dark Vador',
            age: 63
          };

          const newState = characterCollectionReducer.replaceOne(initialState, characterUpdated);

          // assert
          expect(newState.characters.length).toBe(2);
          expect(newState.characters[0].name).toBe('Luke Skywalker');
          expect(newState.characters[0].age).toBe(29);
          expect(newState.characters[1].name).toBe('Dark Vador');
          expect(newState.characters[1].age).toBe(63);
        });

        it('should add one entity if it does not exist', () => {
          // arrange

          // act
          const newCharacter = {
            id: 3,
            name: 'Han Solo',
            age: 31
          };

          const newState = characterCollectionReducer.replaceOne(initialState, newCharacter);

          // assert
          expect(newState.characters.length).toBe(3);
          expect(newState.characters[0].name).toBe('Luke Skywalker');
          expect(newState.characters[0].age).toBe(29);
          expect(newState.characters[1].name).toBe('Anakin Skywalker');
          expect(newState.characters[1].age).toBe(23);
          expect(newState.characters[2].name).toBe('Han Solo');
          expect(newState.characters[2].age).toBe(31);
        });
      });

      describe('nested child state', () => {
        it('should replace one entity if it already exist', () => {
          // arrange

          // act
          const characterUpdated = {
            id: 2,
            name: 'Dark Vador',
            age: 63
          };

          const newState = nestedCharacterCollectionReducer.replaceOne(initialState, characterUpdated);

          // assert
          expect(newState.nested.characters.length).toBe(2);
          expect(newState.nested.characters[0].name).toBe('Luke Skywalker');
          expect(newState.nested.characters[0].age).toBe(29);
          expect(newState.nested.characters[1].name).toBe('Dark Vador');
          expect(newState.nested.characters[1].age).toBe(63);
        });

        it('should add one entity if it does not exist', () => {
          // arrange

          // act
          const newCharacter = {
            id: 3,
            name: 'Han Solo',
            age: 31
          };

          const newState = nestedCharacterCollectionReducer.replaceOne(initialState, newCharacter);

          // assert
          expect(newState.nested.characters.length).toBe(3);
          expect(newState.nested.characters[0].name).toBe('Luke Skywalker');
          expect(newState.nested.characters[0].age).toBe(29);
          expect(newState.nested.characters[1].name).toBe('Anakin Skywalker');
          expect(newState.nested.characters[1].age).toBe(23);
          expect(newState.nested.characters[2].name).toBe('Han Solo');
          expect(newState.nested.characters[2].age).toBe(31);
        });
      });
    });

    describe('removeOne', () => {
      describe('direct child state', () => {
        it('should remove one entity if it already exist', () => {
          // arrange

          // act
          const newState = characterCollectionReducer.removeOne(initialState, 1);

          // assert
          expect(newState.characters.length).toBe(1);
          expect(newState.characters[0].name).toBe('Anakin Skywalker');
          expect(newState.characters[0].age).toBe(23);
        });

        it('should stay intact if key not found', () => {
          // arrange

          // act
          const newState = characterCollectionReducer.removeOne(initialState, 4);

          // assert
          expect(newState.characters.length).toBe(2);
          expect(newState.characters[0].name).toBe('Luke Skywalker');
          expect(newState.characters[0].age).toBe(29);
          expect(newState.characters[1].name).toBe('Anakin Skywalker');
          expect(newState.characters[1].age).toBe(23);
        });
      });

      describe('nested child state', () => {
        it('should replace one entity if it already exist', () => {
          // arrange

          // act
          const characterUpdated = {
            id: 2,
            name: 'Dark Vador',
            age: 63
          };

          const newState = nestedCharacterCollectionReducer.replaceOne(initialState, characterUpdated);

          // assert
          expect(newState.nested.characters.length).toBe(2);
          expect(newState.nested.characters[0].name).toBe('Luke Skywalker');
          expect(newState.nested.characters[1].name).toBe('Dark Vador');
        });

        it('should add one entity if it does not exist', () => {
          // arrange

          // act
          const newCharacter = {
            id: 3,
            name: 'Han Solo',
            age: 31
          };

          const newState = nestedCharacterCollectionReducer.replaceOne(initialState, newCharacter);

          // assert
          expect(newState.nested.characters.length).toBe(3);
          expect(newState.nested.characters[0].name).toBe('Luke Skywalker');
          expect(newState.nested.characters[1].name).toBe('Anakin Skywalker');
          expect(newState.nested.characters[2].name).toBe('Han Solo');
        });
      });
    });

    describe('removeAll', () => {
      describe('direct child state', () => {
        it('should have no entity', () => {
          // arrange

          // act
          const newState = characterCollectionReducer.removeAll(initialState);

          // assert
          expect(newState.characters.length).toBe(0);
        });
      });

      describe('nested child state', () => {
        it('should have no entity', () => {
          // arrange

          // act
          const newState = nestedCharacterCollectionReducer.removeAll(initialState);

          // assert
          expect(newState.nested.characters.length).toBe(0);
        });
      });
    });
  });

  describe('createFeatureCollectionReducer', () => {
    const characterCollectionReducer = createFeatureCollectionReducer<State, Character, number>(
      'characters',
      character => character.id
    );

    const nestedCharacterCollectionReducer = createFeatureCollectionReducer<State, Character, number>(
      'nested.characters',
      character => character.id
    );

    describe('upsertOne', () => {
      describe('direct child state', () => {
        it('should update one entity if it already exist', () => {
          // arrange

          // act
          const characterUpdated = {
            id: 2,
            age: 25
          };

          const newState = characterCollectionReducer.upsertOne(initialState, characterUpdated);

          // assert
          expect(newState.characters.length).toBe(2);
          expect(newState.characters[0].name).toBe('Luke Skywalker');
          expect(newState.characters[0].age).toBe(29);
          expect(newState.characters[1].name).toBe('Anakin Skywalker');
          expect(newState.characters[1].age).toBe(23);
        });

        it('should add one entity if it does not exist', () => {
          // arrange

          // act
          const newCharacter = {
            id: 3,
            name: 'Han Solo',
            age: 31
          };

          const newState = characterCollectionReducer.upsertOne(initialState, newCharacter);

          // assert
          expect(newState.characters.length).toBe(3);
          expect(newState.characters[0].name).toBe('Luke Skywalker');
          expect(newState.characters[0].age).toBe(29);
          expect(newState.characters[1].name).toBe('Anakin Skywalker');
          expect(newState.characters[1].age).toBe(23);
          expect(newState.characters[2].name).toBe('Han Solo');
          expect(newState.characters[2].age).toBe(31);
        });
      });

      describe('nested child state', () => {
        it('should update one entity if it already exist', () => {
          // arrange

          // act
          const characterUpdated = {
            id: 2,
            age: 25
          };

          const newState = nestedCharacterCollectionReducer.upsertOne(initialState, characterUpdated);

          // assert
          expect(newState.nested.characters.length).toBe(2);
          expect(newState.nested.characters[0].name).toBe('Luke Skywalker');
          expect(newState.nested.characters[0].age).toBe(29);
          expect(newState.nested.characters[1].name).toBe('Anakin Skywalker');
          expect(newState.nested.characters[1].age).toBe(23);
        });

        it('should add one entity if it does not exist', () => {
          // arrange

          // act
          const newCharacter = {
            id: 3,
            name: 'Han Solo',
            age: 31
          };

          const newState = nestedCharacterCollectionReducer.upsertOne(initialState, newCharacter);

          // assert
          expect(newState.nested.characters.length).toBe(3);
          expect(newState.nested.characters[0].name).toBe('Luke Skywalker');
          expect(newState.nested.characters[0].age).toBe(29);
          expect(newState.nested.characters[1].name).toBe('Anakin Skywalker');
          expect(newState.nested.characters[1].age).toBe(23);
          expect(newState.nested.characters[2].name).toBe('Han Solo');
          expect(newState.nested.characters[2].age).toBe(31);
        });
      });
    });

    describe('replaceOne', () => {
      describe('direct child state', () => {
        it('should replace one entity if it already exist', () => {
          // arrange

          // act
          const characterUpdated = {
            id: 2,
            name: 'Dark Vador',
            age: 63
          };

          const newState = characterCollectionReducer.replaceOne(initialState, characterUpdated);

          // assert
          expect(newState.characters.length).toBe(2);
          expect(newState.characters[0].name).toBe('Luke Skywalker');
          expect(newState.characters[0].age).toBe(29);
          expect(newState.characters[1].name).toBe('Dark Vador');
          expect(newState.characters[1].age).toBe(63);
        });

        it('should add one entity if it does not exist', () => {
          // arrange

          // act
          const newCharacter = {
            id: 3,
            name: 'Han Solo',
            age: 31
          };

          const newState = characterCollectionReducer.replaceOne(initialState, newCharacter);

          // assert
          expect(newState.characters.length).toBe(3);
          expect(newState.characters[0].name).toBe('Luke Skywalker');
          expect(newState.characters[0].age).toBe(29);
          expect(newState.characters[1].name).toBe('Anakin Skywalker');
          expect(newState.characters[1].age).toBe(23);
          expect(newState.characters[2].name).toBe('Han Solo');
          expect(newState.characters[2].age).toBe(31);
        });
      });

      describe('nested child state', () => {
        it('should replace one entity if it already exist', () => {
          // arrange

          // act
          const characterUpdated = {
            id: 2,
            name: 'Dark Vador',
            age: 63
          };

          const newState = nestedCharacterCollectionReducer.replaceOne(initialState, characterUpdated);

          // assert
          expect(newState.nested.characters.length).toBe(2);
          expect(newState.nested.characters[0].name).toBe('Luke Skywalker');
          expect(newState.nested.characters[0].age).toBe(29);
          expect(newState.nested.characters[1].name).toBe('Dark Vador');
          expect(newState.nested.characters[1].age).toBe(63);
        });

        it('should add one entity if it does not exist', () => {
          // arrange

          // act
          const newCharacter = {
            id: 3,
            name: 'Han Solo',
            age: 31
          };

          const newState = nestedCharacterCollectionReducer.replaceOne(initialState, newCharacter);

          // assert
          expect(newState.nested.characters.length).toBe(3);
          expect(newState.nested.characters[0].name).toBe('Luke Skywalker');
          expect(newState.nested.characters[0].age).toBe(29);
          expect(newState.nested.characters[1].name).toBe('Anakin Skywalker');
          expect(newState.nested.characters[1].age).toBe(23);
          expect(newState.nested.characters[2].name).toBe('Han Solo');
          expect(newState.nested.characters[2].age).toBe(31);
        });
      });
    });

    describe('removeOne', () => {
      describe('direct child state', () => {
        it('should remove one entity if it already exist', () => {
          // arrange

          // act
          const newState = characterCollectionReducer.removeOne(initialState, 1);

          // assert
          expect(newState.characters.length).toBe(1);
          expect(newState.characters[0].name).toBe('Anakin Skywalker');
          expect(newState.characters[0].age).toBe(23);
        });

        it('should stay intact if key not found', () => {
          // arrange

          // act
          const newState = characterCollectionReducer.removeOne(initialState, 4);

          // assert
          expect(newState.characters.length).toBe(2);
          expect(newState.characters[0].name).toBe('Luke Skywalker');
          expect(newState.characters[0].age).toBe(29);
          expect(newState.characters[1].name).toBe('Anakin Skywalker');
          expect(newState.characters[1].age).toBe(23);
        });
      });

      describe('nested child state', () => {
        it('should replace one entity if it already exist', () => {
          // arrange

          // act
          const characterUpdated = {
            id: 2,
            name: 'Dark Vador',
            age: 63
          };

          const newState = nestedCharacterCollectionReducer.replaceOne(initialState, characterUpdated);

          // assert
          expect(newState.nested.characters.length).toBe(2);
          expect(newState.nested.characters[0].name).toBe('Luke Skywalker');
          expect(newState.nested.characters[1].name).toBe('Dark Vador');
        });

        it('should add one entity if it does not exist', () => {
          // arrange

          // act
          const newCharacter = {
            id: 3,
            name: 'Han Solo',
            age: 31
          };

          const newState = nestedCharacterCollectionReducer.replaceOne(initialState, newCharacter);

          // assert
          expect(newState.nested.characters.length).toBe(3);
          expect(newState.nested.characters[0].name).toBe('Luke Skywalker');
          expect(newState.nested.characters[1].name).toBe('Anakin Skywalker');
          expect(newState.nested.characters[2].name).toBe('Han Solo');
        });
      });
    });

    describe('removeAll', () => {
      describe('direct child state', () => {
        it('should have no entity', () => {
          // arrange

          // act
          const newState = characterCollectionReducer.removeAll(initialState);

          // assert
          expect(newState.characters.length).toBe(0);
        });
      });

      describe('nested child state', () => {
        it('should have no entity', () => {
          // arrange

          // act
          const newState = nestedCharacterCollectionReducer.removeAll(initialState);

          // assert
          expect(newState.nested.characters.length).toBe(0);
        });
      });
    });
  });
});
