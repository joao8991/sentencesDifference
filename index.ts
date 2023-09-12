function findFirstCommonWordWithIndexes(
  sentence1: string,
  sentence2: string
): { word: string; index1: number; index2: number } | null {
  const words1 = sentence1.split(" ");
  const words2 = sentence2.split(" ");

  for (let i = 0; i < words1.length; i++) {
    for (let j = 0; j < words2.length; j++) {
      if (words1[i] === words2[j]) {
        return { word: words1[i], index1: i, index2: j };
      }
    }
  }

  return null;
}
function findDifferences(sentence1: string, sentence2: string) {
  const differences: string[] = [];

  let words1 = sentence1.split(" ");
  let words2 = sentence2.split(" ");

  const addDifferences = (removedWords: string[], addedWords: string[]) => {
    removedWords = removedWords.filter((w) => w !== "");
    addedWords = addedWords.filter((w) => w !== "");
    if (removedWords.length > 0)
      differences.push(`-${removedWords.join(" ")}-`);
    if (addedWords.length > 0) differences.push(`+${addedWords.join(" ")}+`);
  };

  let i = 0;
  while (i < words1.length && i < words2.length) {
    while (i < words1.length && i < words2.length && words1[i] === words2[i]) {
      if (words1.length > 0 && words1[i].length > 0)
        differences.push(words1[i]);
      i++;
    }
    words1 = words1.slice(i);
    words2 = words2.slice(i);
    sentence1 = words1.join(" ");
    sentence2 = words2.join(" ");

    const commonIndexes = findFirstCommonWordWithIndexes(sentence1, sentence2);
    if (commonIndexes) {
      const { word, index1, index2 } = commonIndexes;
      console.log(word, index1, index2);
      const removedWords = [];
      for (let w1 = 0; w1 < index1; w1++) {
        removedWords.push(words1[w1]);
      }
      const addedWords = [];
      for (let w2 = 0; w2 < index2; w2++) {
        addedWords.push(words2[w2]);
      }
      addDifferences(removedWords, addedWords);

      words1 = words1.slice(index1);
      words2 = words2.slice(index2);
      i = 0;
    }
    if (commonIndexes === null) {
      addDifferences(words1, words2);

      return differences.join(" ");
    }
  }
  return differences.join(" ");
}

function runTests() {
  function assertEqual(actual: string, expected: string) {
    if (actual === expected) {
      console.log(`Pass: "${expected}"`);
    } else {
      console.error(`Fail\nExpected\t"${expected}"\n but got\t"${actual}"`);
    }
    console.log("\n\n");
  }

  // Test cases
  assertEqual(
    findDifferences("A B C D E F G H I", "K L C D E M N G O"),
    "-A B-+K L+ C D E -F-+M N+ G -H I-+O+"
  );
  assertEqual(
    findDifferences("This is a test", "This is another test"),
    "This is -a-+another+ test"
  );
  assertEqual(findDifferences("One", "Two"), "-One-+Two+");
  assertEqual(findDifferences("", "Hello"), "+Hello+");
  assertEqual(findDifferences("A B", ""), "-A B-");
  assertEqual(
    findDifferences("A B C D E F G H I", "G H I C D E"),
    "-A B-+G H I+ C D E -F G H I-"
  );
  assertEqual(findDifferences("A B", "A B"), "A B"); // No differences
  assertEqual(findDifferences("A B C", "A B"), "A B -C-"); // Remove a word
  assertEqual(findDifferences("A B", "A B C"), "A B +C+"); // Add a word
  assertEqual(findDifferences("A B C", "X Y Z"), "-A B C-+X Y Z+"); // Completely different sentences
}

runTests();
