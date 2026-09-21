import test from 'node:test';
import assert from 'node:assert/strict';
import {search} from './search.mjs';

test('existing default remains literal case-sensitive substring search',()=>{
  assert.deepEqual(search(['Alpha','alpha','ALPHA','alphabet'],'Al'),['Alpha']);
  assert.deepEqual(search(['a.b','axb','A.B'],'a.b'),['a.b']);
  assert.deepEqual(search(['Alpha','alpha'],'Al',{}),['Alpha']);
  assert.deepEqual(search(['Alpha','alpha'],'Al',{caseSensitive:true}),['Alpha']);
});

test('explicit false enables ASCII and accented Unicode matching',()=>{
  assert.deepEqual(search(['Alpha','alpha','ALPHA','beta'],'ALP',{caseSensitive:false}),['Alpha','alpha','ALPHA']);
  assert.deepEqual(search(['École','école','ecole','CAFÉ'],'é',{caseSensitive:false}),['École','école','CAFÉ']);
});

test('Unicode simple folding covers sigma variants and supplementary letters',()=>{
  assert.deepEqual(search(['ΟΣ','ος','οσ','οδ'],'ΟΣ',{caseSensitive:false}),['ΟΣ','ος','οσ']);
  assert.deepEqual(search(['𐐀','𐐨','x'],'𐐨',{caseSensitive:false}),['𐐀','𐐨']);
});

test('insensitive query remains literal for regular-expression punctuation',()=>{
  for(const query of ['a.b','[A]','(A)','A+B','A?','A*','A|B','^A$','A{2}','A\\B','A/B']) {
    assert.deepEqual(search([query,query.toLowerCase(),'unrelated'],query,{caseSensitive:false}),[query,query.toLowerCase()]);
  }
});

test('empty queries, duplicate order and input immutability are preserved',()=>{
  const items=Object.freeze(['B','a','A','a']);
  assert.deepEqual(search(items,'',{caseSensitive:false}),['B','a','A','a']);
  assert.deepEqual(search(items,'a',{caseSensitive:false}),['a','A','a']);
  assert.deepEqual(search(items,'a'),['a','a']);
  assert.deepEqual(search([], 'a',{caseSensitive:false}),[]);
});

test('simple Unicode folding does not imply locale collation or normalization',()=>{
  assert.deepEqual(search(['straße','STRASSE'],'ss',{caseSensitive:false}),['STRASSE']);
  assert.deepEqual(search(['é','e\u0301'],'É',{caseSensitive:false}),['é']);
});
