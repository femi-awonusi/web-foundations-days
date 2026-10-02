
// 1. Starting data
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

// 2. Search notes by word
function searchNotes(word) {
  return notes.filter((note) =>
    note.text.toLowerCase().includes(word.toLowerCase())
  );
}

// 3. Find the longest note
function longestNote() {
  if (notes.length === 0) {
    return null;
  }

  let longest = notes[0];

  for (let note of notes) {
    if (note.text.length > longest.text.length) {
      longest = note;
    }
  }

  return longest;
}

// 4. Count notes by category
function countByCategory() {
  let counts = {
    personal: 0,
    work: 0,
    study: 0,
  };

  for (let note of notes) {
    counts[note.category]++;
  }

  return counts;
}

// 5. Get a summary of notes
function getSummary() {
  const counts = countByCategory();
  const total = notes.length;
  const noteWord = total === 1 ? "note" : "notes";

  return `${total} ${noteWord}: ${counts.personal} personal, ${counts.work} work, ${counts.study} study.`;
}

// 6. Check for duplicate notes
function isDuplicate(text) {
  const cleanedText = text.trim().toLowerCase();

  return notes.some(
    (note) => note.text.trim().toLowerCase() === cleanedText
  );
}

// 7. Add a new note
function addNote(text, category) {
  // Check that the text is a string
  if (typeof text !== "string") {
    console.log("❌ Note rejected: text must be a string.");
    return false;
  }

  const cleanedText = text.trim();

  // Check text length
  if (cleanedText.length === 0 || cleanedText.length > 200) {
    console.log("❌ Note rejected: must be 1-200 characters.");
    return false;
  }

  // Check for duplicates
  if (isDuplicate(cleanedText)) {
    console.log("❌ Note rejected: duplicate note.");
    return false;
  }

  // Check category
  if (!["personal", "work", "study"].includes(category)) {
    console.log("❌ Note rejected: invalid category.");
    return false;
  }

  // Create and add the new note
  const newNote = {
    id: notes.length > 0
      ? Math.max(...notes.map((note) => note.id)) + 1
      : 1,
    text: cleanedText,
    category: category,
  };

  notes.push(newNote);

  console.log(`✅ Note added: "${newNote.text}"`);
  return true;
}

// ----------------------------------
// 8. TESTS
// ----------------------------------

// Test searchNotes
console.log("Search 'day 3':", searchNotes("day 3"));
// Expected: [{ id: 2, text: "Finish the Day 3 assignment", category: "study" }]

console.log("Search 'football':", searchNotes("football"));
// Expected: []

// Test longestNote
console.log("Longest note:", longestNote());
// Expected: { id: 3, text: "Email the project report to Grace", category: "work" }

// Test longestNote with an empty array
let savedNotes = notes;
notes = [];
console.log("Longest note in empty array:", longestNote());
// Expected: null
notes = savedNotes;

// Test countByCategory
console.log("Category counts:", countByCategory());
// Expected: { personal: 2, work: 1, study: 2 }

// Test countByCategory with an empty array
savedNotes = notes;
notes = [];
console.log("Empty category counts:", countByCategory());
// Expected: { personal: 0, work: 0, study: 0 }
notes = savedNotes;

// Test getSummary
console.log("Summary:", getSummary());
// Expected: "5 notes: 2 personal, 1 work, 2 study."

// Test getSummary with exactly one note
savedNotes = notes;
notes = [savedNotes[0]];
console.log("Single-note summary:", getSummary());
// Expected: "1 note: 1 personal, 0 work, 0 study."
notes = savedNotes;

// Test isDuplicate
console.log("Is 'Call mum' a duplicate?", isDuplicate("Call mum"));
// Expected: true

console.log("Is '  CALL MUM  ' a duplicate?", isDuplicate("  CALL MUM  "));
// Expected: true

console.log("Is 'Read a book' a duplicate?", isDuplicate("Read a book"));
// Expected: false

// Test addNote
console.log("Add valid note:", addNote("Read a book", "personal"));
// Expected: "✅ Note added: "Read a book"" followed by true

console.log("Add duplicate:", addNote("  READ A BOOK  ", "personal"));
// Expected: "❌ Note rejected: duplicate note." followed by false

console.log("Add empty note:", addNote("   ", "study"));
// Expected: "❌ Note rejected: must be 1-200 characters." followed by false

console.log("Add invalid category:", addNote("Prepare presentation", "leisure"));
// Expected: "❌ Note rejected: invalid category." followed by false

console.log("Add overlength note:", addNote("a".repeat(201), "work"));
// Expected: "❌ Note rejected: must be 1-200 characters." followed by false

console.log("Final summary:", getSummary());
// Expected: "6 notes: 3 personal, 1 work, 2 study."