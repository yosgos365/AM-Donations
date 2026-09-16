const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf-8');

code = code.replace(
  "export interface User {\n  id: string;",
  `export interface HebrewDateValue {
  year: number;
  month: number;
  day: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  hebrewDob: HebrewDateValue;
}

export interface Yahrzeit {
  id: string;
  name: string;
  hebrewDate: HebrewDateValue;
}

export interface User {
  id: string;
  hebrewDob?: HebrewDateValue;
  familyMembers?: FamilyMember[];
  yahrzeits?: Yahrzeit[];`
);

fs.writeFileSync('src/types.ts', code);
