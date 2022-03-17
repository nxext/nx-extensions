import { Cache } from './decorator/cache-decorator';
import { InMemoryCache } from '@nxextjs/storage';
import { nxextJs } from './cache';

class TestMethodBaseClass {
  add(numOne: number, numTwo: number) {
    return numOne + numTwo;
  }
}

class TestMethodClass extends TestMethodBaseClass {
  override add(numOne: number, numTwo: number) {
    return super.add(numOne, numTwo);
  }
}

class TestMethodMemoizeClass extends TestMethodBaseClass {
  @Cache()
  override add(numOne: number, numTwo: number) {
    return super.add(numOne, numTwo);
  }
}

function setup() {
  const testMethodMemoizeClass: TestMethodMemoizeClass =
    new TestMethodMemoizeClass();
  const testMethodClass: TestMethodClass = new TestMethodClass();
  nxextJs.cache = new InMemoryCache();
  return {
    testMethodMemoizeClass,
    testMethodClass,
  };
}

describe('Testing cache', () => {
  it('Ensure classes is working as expected', () => {
    const { testMethodClass, testMethodMemoizeClass } = setup();
    expect(testMethodClass.add(2, 3) === 5);
    expect(testMethodMemoizeClass.add(2, 3) === 5);
  });
});
