const splitArray = (array: string[]): string[][] => {
  const arr1: string[] = [];
  const arr2: string[] = [];

  for (let i = 0; i < array.length; i++) {
    i % 2 === 0 ? arr1.push(array[i]) : arr2.push(array[i]);
  }

  return [arr1, arr2];
};

export default splitArray;
