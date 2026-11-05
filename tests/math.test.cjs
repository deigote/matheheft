const assert=require('node:assert/strict');
const {test}=require('node:test');
const math=require('../dist/math.js');

test('comma, point, equivalent fractions and exact recurring decimals',()=>{
  for(const [a,b] of [['0,625','5/8'],['0.625','5/8'],['0,(4)','4/9'],['0,41(6)','5/12'],['0,4(3)','13/30'],['0,(9)','1'],['2 11/12','35/12'],['2/6','1/3']])assert.ok(math.equal(a,b),a);
  for(const [a,b] of [['0,4444','4/9'],['0,4166','5/12'],['0,4333','13/30'],['3/0','1'],['abc','0'],['','0'],['2,35','2,305']])assert.equal(math.equal(a,b),false,a);
});
test('required answer form is enforced',()=>{
  assert.ok(math.check(' 7 / 20 ','7/20','reduced'));
  assert.equal(math.check('14/40','7/20','reduced'),false);
  assert.equal(math.check('0,35','7/20','reduced'),false);
  assert.ok(math.check('2 11/12','35/12','mixed'));
  assert.equal(math.check('35/12','35/12','mixed'),false);
  assert.equal(math.check('2 22/24','35/12','mixed'),false);
  assert.equal(math.check('1 23/12','35/12','mixed'),false);
  assert.ok(math.check('0.20','0,2','decimal'));
  assert.equal(math.check('1/5','0,2','decimal'),false);
  assert.equal(math.check('25,0','25','integer'),false);
  assert.equal(math.check('0,35abc','0,35','number'),false);
  assert.ok(math.check('<','<','symbol'));
});
test('rectangle needs sixteen cells and the correct geometry',()=>{
  const added=[3,4,5,6,7,15,16,17,18,19];
  assert.ok(math.rectangle(added));
  assert.equal(math.rectangle(added.slice(1)),false);
  assert.equal(math.rectangle([...added.slice(1),20]),false);
  assert.equal(math.rectangle([...added,35]),false);
  assert.equal(math.rectangle([]),false);
});
test('chocolate must allocate exactly three pieces to each of eight friends',()=>{
  const fair=Array.from({length:24},(_,i)=>Math.floor(i/3)+1);
  assert.ok(math.chocolate(fair));
  assert.equal(math.chocolate(Array(24).fill(1)),false);
  assert.equal(math.chocolate(fair.map((x,i)=>i===0?0:x)),false);
});
