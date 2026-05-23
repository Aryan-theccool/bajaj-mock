const assert = require('assert');
const { generateUserId, isNumberString, isAlphabetString, processData, buildResponse } = require('./src/logic');
const bfhlHandler = require('./api/bfhl');
const { USER } = require('./src/config');

console.log('🧪 Starting Bajaj BFHL API Test Suite...\n');

// 1. Helper mock response creator
function createMockResponse() {
  const res = {
    statusCode: 200,
    headers: {},
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    end(data) {
      this.ended = true;
      if (data) {
        this.body = JSON.parse(data);
      }
      return this;
    }
  };
  return res;
}

// 2. Direct unit tests for helper functions
try {
  console.log('1. Testing generateUserId...');
  const userId = generateUserId(USER.fullName, USER.dob);
  assert.strictEqual(userId, 'aryan_singh_bhadoria_26072005');
  console.log(`✅ generateUserId passed: "${userId}"`);
} catch (error) {
  console.error('❌ generateUserId failed:', error);
  process.exit(1);
}

try {
  console.log('\n2. Testing helper regexes...');
  assert.strictEqual(isNumberString("123"), true);
  assert.strictEqual(isNumberString("-4"), true);
  assert.strictEqual(isNumberString("45a"), false);
  assert.strictEqual(isAlphabetString("A"), true);
  assert.strictEqual(isAlphabetString("ABCD"), true);
  assert.strictEqual(isAlphabetString("123"), false);
  assert.strictEqual(isAlphabetString("A1"), false);
  console.log('✅ Helper regexes passed.');
} catch (error) {
  console.error('❌ Helper regexes failed:', error);
  process.exit(1);
}

// 3. API Handler Integration Tests (Examples A, B, C, Invalid)

try {
  console.log('\n3. Testing Example A (Mixed numbers and alphabets)...');
  const req = {
    method: 'POST',
    body: { data: ["A", "1", "334", "4", "R"] }
  };
  const res = createMockResponse();

  bfhlHandler(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.is_success, true);
  assert.deepStrictEqual(res.body.numbers, ["1", "334", "4"]);
  assert.deepStrictEqual(res.body.alphabets, ["A", "R"]);
  
  // Verify exact schema keys
  const keys = Object.keys(res.body);
  const expectedKeys = ["is_success", "user_id", "email", "roll_number", "numbers", "alphabets"];
  assert.deepStrictEqual(keys.sort(), expectedKeys.sort());
  console.log('✅ Example A passed.');
} catch (error) {
  console.error('❌ Example A failed:', error);
  process.exit(1);
}

try {
  console.log('\n4. Testing Example B (Numbers only)...');
  const req = {
    method: 'POST',
    body: { data: ["2", "4", "5", "92"] }
  };
  const res = createMockResponse();

  bfhlHandler(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.is_success, true);
  assert.deepStrictEqual(res.body.numbers, ["2", "4", "5", "92"]);
  assert.deepStrictEqual(res.body.alphabets, []);
  console.log('✅ Example B passed.');
} catch (error) {
  console.error('❌ Example B failed:', error);
  process.exit(1);
}

try {
  console.log('\n5. Testing Example C (Alphabets and words)...');
  const req = {
    method: 'POST',
    body: { data: ["A", "ABCD", "DOE"] }
  };
  const res = createMockResponse();

  bfhlHandler(req, res);

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.is_success, true);
  assert.deepStrictEqual(res.body.numbers, []);
  assert.deepStrictEqual(res.body.alphabets, ["A", "ABCD", "DOE"]);
  console.log('✅ Example C passed.');
} catch (error) {
  console.error('❌ Example C failed:', error);
  process.exit(1);
}

try {
  console.log('\n6. Testing Invalid input (Empty object)...');
  const req = {
    method: 'POST',
    body: {}
  };
  const res = createMockResponse();

  bfhlHandler(req, res);

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.body.is_success, false);
  assert.deepStrictEqual(res.body.numbers, []);
  assert.deepStrictEqual(res.body.alphabets, []);
  console.log('✅ Invalid input validation passed.');
} catch (error) {
  console.error('❌ Invalid input validation failed:', error);
  process.exit(1);
}

try {
  console.log('\n7. Testing HTTP Method Restricton (GET reject)...');
  const req = {
    method: 'GET'
  };
  const res = createMockResponse();

  bfhlHandler(req, res);

  assert.strictEqual(res.statusCode, 405);
  assert.strictEqual(res.body.is_success, false);
  console.log('✅ GET request rejection passed.');
} catch (error) {
  console.error('❌ GET request rejection failed:', error);
  process.exit(1);
}

console.log('\n🎉 All test suites passed successfully with zero issues!');
