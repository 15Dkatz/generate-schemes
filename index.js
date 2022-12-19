const fs = require('fs');
// TODO: The algorithm will be limited up to 8 letters, A-H, for now.
const patternLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const idNumbers = ['1', '2', '3', '4', '5', '6', '7', '8'];

const recursivelyGenerateSchemeSet = ({ builtScheme, letters, schemeSet }) => {
  if (builtScheme.length === letters.length) {
    // console.log(`builtScheme`, builtScheme);

    schemeSet.add(builtScheme);

    return;
  }

  for (let i=0; i<letters.length; i++) {
    const nextLetter = letters[i];
    const newScheme = builtScheme + nextLetter;

    // console.log(`nextLetter`, nextLetter);
    // console.log(`newScheme`, newScheme);

    recursivelyGenerateSchemeSet({ builtScheme: newScheme, letters, schemeSet })
  }
};

const generateSchemeSet = ({ length }) => {
  const letters = patternLetters.slice(0, length);
  const schemeSet = new Set();

  // console.log(`letters`, letters);

  // instatiate set
  // generate all possible schemes
  // for each, add scheme to set

  const initialLetter = letters[0];

  recursivelyGenerateSchemeSet({ builtScheme: initialLetter, letters, schemeSet });

  // AABB must be different from BBCC, CCDD, etc.
  // remove duplicates by giving each letter in the scheme an ID, internal to that set
  // keep track of all the scheme by IDs
  // only maintain a scheme if the ID set does not exist
  const schemeArray = Array.from(schemeSet);
  const schemeIdSet = new Set();

  for (let i=0; i<schemeArray.length; i++) {
    const scheme = schemeArray[i];
    // key:value, schemeLetter:id
    const associationsMap = {};

    // console.log(`scheme`, scheme);

    for (let j=0; j<scheme.length; j++) {
      const schemeLetter = scheme[j];

      if (!associationsMap[schemeLetter]) {
        // find an id for the schemeLetter
        const existingAssociationIds = Object.keys(associationsMap);
        // console.log(`existingAssociationIds`, existingAssociationIds);
        const idNumber = idNumbers[existingAssociationIds.length];

        associationsMap[schemeLetter] = idNumber;
      }
    }

    // generate the schemeId, add to schemeIdSet
    const schemeId = scheme.split('').map(letter => associationsMap[letter]).join('');
    schemeIdSet.add(schemeId);
  }

  // console.log(`schemeIdSet`, schemeIdSet);
  const schemeIds = Array.from(schemeIdSet);

  const finalSchemeSet = new Set();

  for (let i=0; i<schemeIds.length; i++) {
    // convert each schemeId to the equivalent patternLetter based on index
    const schemeId = schemeIds[i];
    let scheme = '';

    schemeId.split('').forEach(idNumber => {
      const idNumbersIndex = idNumbers.indexOf(idNumber);

      scheme += patternLetters[idNumbersIndex];
    });

    finalSchemeSet.add(scheme);
  }

  return Array.from(finalSchemeSet);
}

const results = generateSchemeSet({ length: 6 });

console.log(`results`, results);
console.log(`results.length`, results.length);

fs.writeFileSync('./tmp', JSON.stringify(results));
