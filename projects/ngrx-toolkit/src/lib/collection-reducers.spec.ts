import { TestBed } from '@angular/core/testing';
import { createCollectionReducer } from './collection-reducers';

type Character = {
  id: number;
  name: string;
}

type State = {
  characters: Character[];
  nested: {
    characters: Character[];
  };
}

describe('collection reducers', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  describe('createCollectionReducer', () => {
    const initialState = {
      characters: [
        {
          id: 1,
          name: 'Luke Skywalker'
        },
        {
          id: 2,
          name: 'Anakin Skywalker'
        }
      ],
      nested: {
        characters: [
          {
            id: 1,
            name: 'Luke Skywalker'
          },
          {
            id: 2,
            name: 'Anakin Skywalker'
          }
        ]
      }
    };

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

    describe('replaceOne', () => {
      describe('direct child state', () => {
        it('should replace one entity if it already exist', () => {
          // arrange

          // act
          const characterUpdated = {
            id: 2,
            name: 'Dark Vador'
          };
  
          const newState = characterCollectionReducer.replaceOne(initialState, characterUpdated);
  
          // assert
          expect(newState.characters.length).toBe(2);
          expect(newState.characters[0].name).toBe('Luke Skywalker');
          expect(newState.characters[1].name).toBe('Dark Vador');
        });
      });
      
      describe('nested child state', () => {
        it('should replace one entity if it already exist', () => {
          // arrange

          // act
          const characterUpdated = {
            id: 2,
            name: 'Dark Vador'
          };
  
          const newState = nestedCharacterCollectionReducer.replaceOne(initialState, characterUpdated);
  
          // assert
          expect(newState.nested.characters.length).toBe(2);
          expect(newState.nested.characters[0].name).toBe('Luke Skywalker');
          expect(newState.nested.characters[1].name).toBe('Dark Vador');
        });
      });
    });
  });
});
