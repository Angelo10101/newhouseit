#!/usr/bin/env node

/**
 * Test script for the AI Business Recommendation API
 * 
 * Usage: 
 *   node test-api.js
 * 
 * Note: Make sure the backend server is running on http://localhost:3001
 */

const API_URL = 'http://localhost:3001';

// Test data
const businesses = [
  {
    id: 'electrician-1',
    name: 'Lightning Electric Co.',
    category: 'Electrician',
    description: 'Professional electrical services with over 20 years of experience. We specialize in residential and commercial electrical installations, repairs, and maintenance.',
  },
  {
    id: 'plumbing-1',
    name: 'AquaFix Pro',
    category: 'Plumbing',
    description: 'Expert plumbing services for all your needs. From leak repairs to complete bathroom installations.',
  },
  {
    id: 'roofing-1',
    name: 'TopShield Roofing',
    category: 'Roofing',
    description: 'Premium roofing services. From repairs to complete roof replacements, we do it all.',
  },
  {
    id: 'painting-1',
    name: 'ColorCraft Painters',
    category: 'Painting',
    description: 'Professional painting services for residential and commercial properties. Quality finish guaranteed.',
  },
];

// Test scenarios
const testScenarios = [
  {
    name: 'Electrical Problem',
    userProblem: 'My lights keep flickering and sometimes go out completely',
    expectedCategory: 'Electrician',
  },
  {
    name: 'Plumbing Problem',
    userProblem: 'I have a leaky faucet in my kitchen that drips constantly',
    expectedCategory: 'Plumbing',
  },
  {
    name: 'Roofing Problem',
    userProblem: 'My roof is leaking when it rains',
    expectedCategory: 'Roofing',
  },
  {
    name: 'Painting Problem',
    userProblem: 'I need to repaint my living room walls',
    expectedCategory: 'Painting',
  },
  {
    name: 'Unrelated Problem',
    userProblem: 'I need a haircut',
    expectedCategory: 'NO_MATCH',
  },
];

async function testHealthEndpoint() {
  console.log('\n🏥 Testing health endpoint...');
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    console.log('✅ Health check passed:', data);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

async function testRecommendation(scenario) {
  console.log(`\n🧪 Testing: ${scenario.name}`);
  console.log(`   Problem: "${scenario.userProblem}"`);
  console.log(`   Expected: ${scenario.expectedCategory}`);

  try {
    const response = await fetch(`${API_URL}/api/recommend-business`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userProblem: scenario.userProblem,
        businesses: businesses,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ API Error:', error);
      return false;
    }

    const result = await response.json();
    console.log(`   Result: ${result.recommendedBusinessId}`);
    console.log(`   Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`   Reason: ${result.reason}`);

    // Verify result
    if (result.recommendedBusinessId === 'NO_MATCH') {
      if (scenario.expectedCategory === 'NO_MATCH') {
        console.log('✅ Test passed: Correctly returned NO_MATCH');
        return true;
      } else {
        console.log('⚠️  Warning: Expected a match but got NO_MATCH');
        return false;
      }
    } else {
      const recommendedBusiness = businesses.find(b => b.id === result.recommendedBusinessId);
      if (recommendedBusiness) {
        console.log(`   Recommended: ${recommendedBusiness.name} (${recommendedBusiness.category})`);
        if (recommendedBusiness.category === scenario.expectedCategory) {
          console.log('✅ Test passed: Correct business category');
          return true;
        } else {
          console.log(`⚠️  Warning: Expected ${scenario.expectedCategory} but got ${recommendedBusiness.category}`);
          return false;
        }
      } else {
        console.log('❌ Test failed: Recommended business not in the list');
        return false;
      }
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting API tests...');
  console.log(`📍 API URL: ${API_URL}`);

  // Test health endpoint
  const healthOk = await testHealthEndpoint();
  if (!healthOk) {
    console.error('\n❌ Server is not responding. Make sure the backend is running on port 3001');
    console.error('   Start the backend with: cd backend && npm start');
    process.exit(1);
  }

  // Run all test scenarios
  let passed = 0;
  let failed = 0;

  for (const scenario of testScenarios) {
    const result = await testRecommendation(scenario);
    if (result) {
      passed++;
    } else {
      failed++;
    }
    // Wait a bit between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Summary');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total: ${passed + failed}`);
  console.log('='.repeat(50));

  if (failed === 0) {
    console.log('\n🎉 All tests passed!');
  } else {
    console.log('\n⚠️  Some tests failed. This may be due to AI variability.');
    console.log('   The AI might interpret problems differently each time.');
  }
}

// Run the tests
runTests().catch(console.error);
