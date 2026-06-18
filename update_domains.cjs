const fs = require('fs');

const filePath = './src/data/universities.ts';
let content = fs.readFileSync(filePath, 'utf8');

// The pattern to match university objects
// Example: { id: 'f1', name: 'Abubakar Tafawa Balewa University', state: 'Bauchi', abbreviation: 'ATBU', location: 'Bauchi', funding: 'Federal', founded: '1980' }

// We can replace the lines by finding abbreviation and adding emailDomains if not present
content = content.replace(/({.*abbreviation:\s*'([^']+)'(?:.*?)})/g, (match, fullMatch, abbreviation) => {
  if (fullMatch.includes('emailDomains')) {
    return fullMatch; // already has it
  }
  
  const domain = abbreviation.toLowerCase() + '.edu.ng';
  // Insert it right before the closing brace
  return fullMatch.replace(/}$/, `, emailDomains: ['${domain}'] }`);
});

// For NOUN, let's also add noun.edu.ng
// We just do a generic replacement for all that don't have it

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated universities.ts with email domains based on abbreviations.');
